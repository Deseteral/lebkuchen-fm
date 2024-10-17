package xyz.lebkuchenfm

import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import kotlinx.serialization.Serializable

fun Route.xSoundsRouting(xSoundsService: XSoundsService) {
    route("/xsounds") {
        get {
            val sounds = xSoundsService.getAllXSounds()
            val response = XSoundsResponse(sounds)
            call.respond(response)
        }
    }
}

@Serializable data class XSoundsResponse(val sounds: List<XSound>)
