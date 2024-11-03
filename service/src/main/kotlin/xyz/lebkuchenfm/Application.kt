package xyz.lebkuchenfm

import io.ktor.http.HttpStatusCode
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.form
import io.ktor.server.auth.session
import io.ktor.server.http.content.staticResources
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.response.respond
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
import io.ktor.server.sessions.SessionStorageMemory
import io.ktor.server.sessions.Sessions
import io.ktor.server.sessions.cookie
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import xyz.lebkuchenfm.api.auth.UserSession
import xyz.lebkuchenfm.api.auth.authRouting
import xyz.lebkuchenfm.api.commands.commandsRouting
import xyz.lebkuchenfm.api.songs.songsRouting
import xyz.lebkuchenfm.api.xsounds.xSoundsRouting
import xyz.lebkuchenfm.domain.commands.CommandExecutorService
import xyz.lebkuchenfm.domain.commands.CommandProcessorRegistry
import xyz.lebkuchenfm.domain.commands.TextCommandParser
import xyz.lebkuchenfm.domain.commands.processors.XCommandProcessor
import xyz.lebkuchenfm.domain.songs.SongsService
import xyz.lebkuchenfm.domain.xsounds.XSoundsService
import xyz.lebkuchenfm.external.DummyEventStream
import xyz.lebkuchenfm.external.storage.dropbox.DropboxClient
import xyz.lebkuchenfm.external.storage.dropbox.XSoundsDropboxFileRepository
import xyz.lebkuchenfm.external.storage.mongo.MongoDatabaseClient
import xyz.lebkuchenfm.external.storage.mongo.repositories.SongsMongoRepository
import xyz.lebkuchenfm.external.storage.mongo.repositories.XSoundsMongoRepository
import xyz.lebkuchenfm.external.youtube.YoutubeClient

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    install(ContentNegotiation) { json() }

    install(Sessions) {
        // TODO: In-memory storage is temporary. We have to implement a custom storage in Mongo.
        val days30 = 30 * 24 * 60 * 60 * 1000L
        cookie<UserSession>("user_session", SessionStorageMemory()) {
            cookie.path = "/"
            cookie.maxAgeInSeconds = days30
            // TODO: The cookie should be signed, I guess?
        }
    }

    install(Authentication) {
        form("auth-form") {
            userParamName = "username"
            passwordParamName = "password"
            validate { credentials ->
                // TODO: Actually validate the credentials.
                if (credentials.name == "admin" && credentials.password == "test") {
                    UserSession(credentials.name)
                } else {
                    null
                }
            }
            challenge {
                call.respond(HttpStatusCode.Unauthorized)
            }
        }
        session<UserSession>("auth-session") {
            validate { session -> session }
            skipWhen { call -> call.sessions.get<UserSession>() != null }
            challenge {
                call.respond(HttpStatusCode.Unauthorized)
            }
        }
        // TODO: We should add another auth handler for API Token header.
    }

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
        ),
    )
    val commandExecutorService = CommandExecutorService(textCommandParser, commandProcessorRegistry, commandPrompt)

    routing {
        // TODO: This route should be using authenticate("auth-session") when the whole auth flow is done.
        // authenticate("auth-session") {
        route("/api") {
            authRouting()
            xSoundsRouting(xSoundsService)
            songsRouting(songsService)
            commandsRouting(commandExecutorService)
        }
        // }

        // TODO: remove me
        route("/test") {
            get {
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
