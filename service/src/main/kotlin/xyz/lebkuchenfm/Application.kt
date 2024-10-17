package xyz.lebkuchenfm

import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.http.content.staticResources
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
import xyz.lebkuchenfm.infrastructure.MongoDatabaseClient

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    install(ContentNegotiation) { json() }

    val database = MongoDatabaseClient.getDatabase(environment.config)

    val xSoundsRepository = XSoundsRepository(database)
    val xSoundsService = XSoundsService(xSoundsRepository)

    routing {
        route("/api") {
            xSoundsRouting(xSoundsService)
        }
        staticResources("/", "static")
    }
}
