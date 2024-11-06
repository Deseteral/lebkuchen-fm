package xyz.lebkuchenfm

import io.ktor.http.HttpStatusCode
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.bearer
import io.ktor.server.auth.form
import io.ktor.server.auth.session
import io.ktor.server.http.content.staticResources
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
import io.ktor.server.sessions.Sessions
import io.ktor.server.sessions.cookie
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.api.auth.authRouting
import xyz.lebkuchenfm.api.commands.commandsRouting
import xyz.lebkuchenfm.api.songs.SongResponse
import xyz.lebkuchenfm.api.songs.songsRouting
import xyz.lebkuchenfm.api.xsounds.xSoundsRouting
import xyz.lebkuchenfm.domain.auth.AuthService
import xyz.lebkuchenfm.domain.auth.UserSession
import xyz.lebkuchenfm.domain.commands.CommandExecutorService
import xyz.lebkuchenfm.domain.commands.CommandProcessorRegistry
import xyz.lebkuchenfm.domain.commands.TextCommandParser
import xyz.lebkuchenfm.domain.commands.processors.SongRandomCommandProcessor
import xyz.lebkuchenfm.domain.commands.processors.XCommandProcessor
import xyz.lebkuchenfm.domain.songs.SongsService
import xyz.lebkuchenfm.domain.xsounds.XSoundsService
import xyz.lebkuchenfm.external.DummyEventStream
import xyz.lebkuchenfm.external.SessionStorageMongo
import xyz.lebkuchenfm.external.discord.DiscordClient
import xyz.lebkuchenfm.external.storage.dropbox.DropboxClient
import xyz.lebkuchenfm.external.storage.dropbox.XSoundsDropboxFileRepository
import xyz.lebkuchenfm.external.storage.mongo.MongoDatabaseClient
import xyz.lebkuchenfm.external.storage.mongo.repositories.SongsMongoRepository
import xyz.lebkuchenfm.external.storage.mongo.repositories.XSoundsMongoRepository
import xyz.lebkuchenfm.external.youtube.YoutubeClient
import kotlin.time.Duration.Companion.days

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    val authService = AuthService()

    val database = MongoDatabaseClient.getDatabase(environment.config)
    val dropboxClient = DropboxClient(environment.config)

    val xSoundsFileRepository = XSoundsDropboxFileRepository(dropboxClient, environment.config)
    val xSoundsRepository = XSoundsMongoRepository(database)
    val xSoundsService = XSoundsService(xSoundsRepository, xSoundsFileRepository)

    val songsRepository = SongsMongoRepository(database)
    val songsService = SongsService(songsRepository)

    val youtubeClient = YoutubeClient(environment.config)

    val eventStream = DummyEventStream() // TODO: To be replaced with actual WebSocket implementation.

    val commandPrompt = environment.config.property("commandPrompt").getString()
    val textCommandParser = TextCommandParser(commandPrompt)
    val commandProcessorRegistry = CommandProcessorRegistry(
        listOf(
            XCommandProcessor(xSoundsService, eventStream),
            SongRandomCommandProcessor(songsService, eventStream),
        ),
    )
    val commandExecutorService = CommandExecutorService(textCommandParser, commandProcessorRegistry, commandPrompt)

    val discordClient = DiscordClient(environment.config, commandExecutorService)
    launch { discordClient.start() }

    install(ContentNegotiation) {
        json()
    }

    install(Sessions) {
        cookie<UserSession>("user_session", SessionStorageMongo()) {
            cookie.path = "/"
            cookie.maxAgeInSeconds = 30.days.inWholeSeconds
            // TODO: The cookie should be signed, I guess?
        }
    }

    install(Authentication) {
        form("auth-form") {
            userParamName = "username"
            passwordParamName = "password"
            validate { credentials ->
                authService.authenticateWithCredentials(credentials.name, credentials.password)
            }
            challenge {
                call.respond(HttpStatusCode.Unauthorized)
            }
        }
        session<UserSession>("auth-session") {
            validate { session -> session }
            challenge {
                call.respond(HttpStatusCode.Unauthorized)
            }
        }
        bearer("auth-bearer") {
            authenticate { tokenCredential ->
                authService.authenticateWithApiToken(tokenCredential.token)
            }
        }
    }

    routing {
        // TODO: This route should be secured using auth-session and auth-bearer when the whole auth flow is done.
        route("/api") {
            authRouting()
            xSoundsRouting(xSoundsService)
            songsRouting(songsService)
            commandsRouting(commandExecutorService)
        }

        // TODO: Remove me.
        authenticate("auth-session") {
            authenticate("auth-bearer") {
                get("/auth-test") {
                    call.respondText { "You are authenticated!" }
                }
            }
        }

        // TODO: remove me
        route("/test") {
            get {
                call.request.queryParameters["randomQt"]?.let {
                    val result = songsService.getRandomAvailableSongs(
                        it.toInt(),
                        call.request.queryParameters["randomPhrase"],
                    )

                    @Serializable data class SongResponse(val name: String)

                    @Serializable data class SongsResponse(val songs: List<SongResponse>)
                    call.respond(SongsResponse(songs = result.map { song -> SongResponse(song.name) }))
                }
                call.request.queryParameters["youtubeId"]?.let { youtubeId ->
                    val result = youtubeClient.getVideoName(youtubeId)
                    if (result.isOk) {
                        call.respond(HttpStatusCode.OK, result.value)
                    } else {
                        call.respond(HttpStatusCode.InternalServerError, result.error.toString())
                    }
                }
            }
        }

        staticResources("/", "static")
    }
}
