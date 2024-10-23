package xyz.lebkuchenfm.api.xsounds

import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.xsounds.XSound
import xyz.lebkuchenfm.domain.xsounds.XSoundsService

fun Route.xSoundsRouting(xSoundsService: XSoundsService) {
    route("/x-sounds") {
        get {
            val sounds = xSoundsService.getAllXSounds()
            val response = XSoundsResponse(sounds.map { it.toResponse() })
            call.respond(response)
        }
    }
}

@Serializable data class XSoundsResponse(val sounds: List<XSoundResponse>)

@Serializable data class XSoundResponse(val id: String, val name: String)

fun XSound.toResponse(): XSoundResponse {
    return XSoundResponse(id = this.id, name = this.name)
}
