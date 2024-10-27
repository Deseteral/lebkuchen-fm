package xyz.lebkuchenfm

import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.http.content.staticResources
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
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
import xyz.lebkuchenfm.external.storage.MongoDatabaseClient
import xyz.lebkuchenfm.external.storage.dropbox.DropboxFileStorage
import xyz.lebkuchenfm.external.storage.dropbox.XSoundsDropboxFileRepository
import xyz.lebkuchenfm.external.storage.repos.SongsMongoRepository
import xyz.lebkuchenfm.external.storage.repos.XSoundsMongoRepository

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    install(ContentNegotiation) { json() }

    val database = MongoDatabaseClient.getDatabase(environment.config)
    val dropboxFileStorage = DropboxFileStorage(environment.config)

    val xSoundsFileRepository = XSoundsDropboxFileRepository(dropboxFileStorage, environment.config)
    val xSoundsRepository = XSoundsMongoRepository(database)
    val xSoundsService = XSoundsService(xSoundsRepository, xSoundsFileRepository)

    val songsRepository = SongsMongoRepository(database)
    val songsService = SongsService(songsRepository)

    val eventStream = DummyEventStream() // TODO: To be replaced with actual WebSocket implementation.

    val textCommandParser = TextCommandParser(environment.config.property("commandPrompt").toString())
    val commandProcessorRegistry =
        CommandProcessorRegistry(
            listOf(
                XCommandProcessor(xSoundsService, eventStream),
            ),
        )
    val commandExecutorService = CommandExecutorService(textCommandParser, commandProcessorRegistry)

    routing {
        route("/api") {
            xSoundsRouting(xSoundsService)
            songsRouting(songsService)
            commandsRouting(commandExecutorService)
        }
        staticResources("/", "static")
    }
}
