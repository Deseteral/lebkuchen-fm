package xyz.lebkuchenfm

import io.ktor.http.HttpStatusCode
import io.ktor.serialization.kotlinx.KotlinxWebsocketSerializationConverter
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.bearer
import io.ktor.server.auth.form
import io.ktor.server.auth.session
import io.ktor.server.http.content.singlePageApplication
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.response.respond
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
import io.ktor.server.sessions.Sessions
import io.ktor.server.sessions.cookie
import io.ktor.server.websocket.WebSockets
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.datetime.Clock
import kotlinx.serialization.json.Json
import xyz.lebkuchenfm.api.auth.authRouting
import xyz.lebkuchenfm.api.commands.commandsRouting
import xyz.lebkuchenfm.api.eventstream.WebSocketEventStream
import xyz.lebkuchenfm.api.eventstream.eventStreamRouting
import xyz.lebkuchenfm.api.eventstream.models.DefaultPlayerStateDtoProvider
import xyz.lebkuchenfm.api.songs.songsRouting
import xyz.lebkuchenfm.api.xsounds.xSoundsRouting
import xyz.lebkuchenfm.domain.auth.AuthService
import xyz.lebkuchenfm.domain.auth.UserSession
import xyz.lebkuchenfm.domain.commands.CommandExecutorService
import xyz.lebkuchenfm.domain.commands.CommandProcessorRegistry
import xyz.lebkuchenfm.domain.commands.TextCommandParser
import xyz.lebkuchenfm.domain.commands.processors.HelpCommandProcessor
import xyz.lebkuchenfm.domain.commands.processors.PlaybackPauseCommandProcessor
import xyz.lebkuchenfm.domain.commands.processors.PlaybackResumeCommandProcessor
import xyz.lebkuchenfm.domain.commands.processors.PlaybackSkipCommandProcessor
import xyz.lebkuchenfm.domain.commands.processors.SongQueueCommandProcessor
import xyz.lebkuchenfm.domain.commands.processors.SongRandomCommandProcessor
import xyz.lebkuchenfm.domain.commands.processors.SongSearchCommandProcessor
import xyz.lebkuchenfm.domain.commands.processors.TagAddCommandProcessor
import xyz.lebkuchenfm.domain.commands.processors.TagListCommandProcessor
import xyz.lebkuchenfm.domain.commands.processors.TagRemoveCommandProcessor
import xyz.lebkuchenfm.domain.commands.processors.XCommandProcessor
import xyz.lebkuchenfm.domain.eventstream.PlayerStateSynchronizer
import xyz.lebkuchenfm.domain.songs.SongsService
import xyz.lebkuchenfm.domain.users.UsersService
import xyz.lebkuchenfm.domain.xsounds.XSoundsService
import xyz.lebkuchenfm.external.discord.DiscordClient
import xyz.lebkuchenfm.external.security.Pbkdf2PasswordEncoder
import xyz.lebkuchenfm.external.security.RandomSecureGenerator
import xyz.lebkuchenfm.external.security.SessionStorageMongo
import xyz.lebkuchenfm.external.storage.dropbox.DropboxClient
import xyz.lebkuchenfm.external.storage.dropbox.XSoundsDropboxFileRepository
import xyz.lebkuchenfm.external.storage.mongo.MongoDatabaseClient
import xyz.lebkuchenfm.external.storage.mongo.repositories.HistoryMongoRepository
import xyz.lebkuchenfm.external.storage.mongo.repositories.SessionsMongoRepository
import xyz.lebkuchenfm.external.storage.mongo.repositories.SongsMongoRepository
import xyz.lebkuchenfm.external.storage.mongo.repositories.UsersMongoRepository
import xyz.lebkuchenfm.external.storage.mongo.repositories.XSoundsMongoRepository
import xyz.lebkuchenfm.external.youtube.YouTubeDataRepository
import xyz.lebkuchenfm.external.youtube.YoutubeClient
import kotlin.time.Duration.Companion.days

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    val database = MongoDatabaseClient.getDatabase(environment.config)
    val dropboxClient = DropboxClient(environment.config)
    val youtubeClient = YoutubeClient(environment.config)

    val usersRepository = UsersMongoRepository(database)
        .also { runBlocking { it.createUniqueIndex() } }
    val passwordEncoder = Pbkdf2PasswordEncoder()
    val secureGenerator = RandomSecureGenerator()
    val usersService = UsersService(usersRepository, passwordEncoder, secureGenerator, Clock.System)
    val authService = AuthService(usersService)

    val xSoundsFileRepository = XSoundsDropboxFileRepository(dropboxClient, environment.config)
    val xSoundsRepository = XSoundsMongoRepository(database)
        .also { runBlocking { it.createUniqueIndex() } }
    val xSoundsService = XSoundsService(xSoundsRepository, xSoundsFileRepository)

    val songsRepository = SongsMongoRepository(database)
        .also { runBlocking { it.createTextIndex() } }
    val historyRepository = HistoryMongoRepository(database)
    val youtubeRepository = YouTubeDataRepository(youtubeClient)
    val songsService = SongsService(songsRepository, youtubeRepository, historyRepository, Clock.System)

    val eventStream = WebSocketEventStream()

    val playerStateSynchronizer = PlayerStateSynchronizer(eventStream, DefaultPlayerStateDtoProvider)

    val commandPrompt = environment.config.property("commandPrompt").getString()
    val textCommandParser = TextCommandParser(commandPrompt)
    val helpCommandProcessor = HelpCommandProcessor(commandPrompt)
    val commandProcessorRegistry = CommandProcessorRegistry(
        listOf(
            XCommandProcessor(xSoundsService, eventStream),
            TagAddCommandProcessor(xSoundsService),
            TagRemoveCommandProcessor(xSoundsService),
            TagListCommandProcessor(xSoundsService),
            SongRandomCommandProcessor(songsService, eventStream),
            SongSearchCommandProcessor(songsService, eventStream),
            SongQueueCommandProcessor(songsService, eventStream),
            PlaybackPauseCommandProcessor(eventStream),
            PlaybackResumeCommandProcessor(eventStream),
            PlaybackSkipCommandProcessor(eventStream),
            helpCommandProcessor,
        ),
    )
    helpCommandProcessor.setCommandRegistry(commandProcessorRegistry)

    val commandExecutorService = CommandExecutorService(textCommandParser, commandProcessorRegistry, commandPrompt)

    val discordClient = DiscordClient(environment.config, commandExecutorService, usersService)
    launch { discordClient.start() }

    install(ContentNegotiation) {
        json()
    }

    install(Sessions) {
        val sessionsMongoRepository = SessionsMongoRepository(database)
        val sessionStorage = SessionStorageMongo(sessionsMongoRepository)
        cookie<UserSession>("user_session", sessionStorage) {
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

    install(WebSockets) {
        val webSocketJsonConverter = Json {
            encodeDefaults = true
            classDiscriminator = "id"
        }
        contentConverter = KotlinxWebsocketSerializationConverter(webSocketJsonConverter)
    }

    routing {
        authenticate("auth-session") {
            authenticate("auth-bearer") {
                route("/api") {
                    authRouting()
                    xSoundsRouting(xSoundsService)
                    songsRouting(songsService)
                    commandsRouting(commandExecutorService)
                    eventStreamRouting(eventStream, playerStateSynchronizer)
                }
            }
        }

        singlePageApplication {
            useResources = true
            filesPath = "static"
            defaultPage = "index.html"
        }
    }
}
