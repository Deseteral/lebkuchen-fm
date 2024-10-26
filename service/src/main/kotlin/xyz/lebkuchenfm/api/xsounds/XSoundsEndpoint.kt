package xyz.lebkuchenfm.api.xsounds

import io.ktor.http.HttpStatusCode
import io.ktor.http.content.PartData
import io.ktor.http.content.forEachPart
import io.ktor.server.request.receiveMultipart
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import io.ktor.utils.io.readRemaining
import kotlinx.io.readByteArray
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import xyz.lebkuchenfm.domain.xsounds.XSound
import xyz.lebkuchenfm.domain.xsounds.XSoundsService

fun Route.xSoundsRouting(xSoundsService: XSoundsService) {
    route("/x-sounds") {
        get {
            val sounds = xSoundsService.getAllXSounds()
            val response = XSoundsResponse(sounds.map { it.toResponse() })
            call.respond(response)
        }

        post {
            var soundName = ""
            var tags: List<String> = emptyList()
            var fileBytes: ByteArray? = null

            val multipartData = call.receiveMultipart()

            multipartData.forEachPart { part ->
                when (part) {
                    is PartData.FormItem -> {
                        if (part.name == "soundName") {
                            // TODO: `soundName` validation ((null, empty, special characters, no file extension in name))
                            soundName = part.value
                        } else if (part.name == "tags") {
                            tags = part.value.split(',').map { it.trim() }
                        }
                    }

                    is PartData.FileItem -> {
                        // TODO: handle "no file" error
                        fileBytes = part.provider().readRemaining().readByteArray()
                    }

                    else -> {}
                }
                part.dispose()
            }

            fileBytes?.let { bytes ->
                // TODO: pass authenticated user name as "addedBy"
                val sound = xSoundsService.addNewXSound(soundName, tags, bytes)
                val response = Json.encodeToString(XSoundResponse.serializer(), sound.toResponse())
                call.respond(HttpStatusCode.Created, response)
            }
        }
    }
}

@Serializable
data class XSoundsResponse(val sounds: List<XSoundResponse>)

@Serializable
data class XSoundResponse(
    val name: String,
    val url: String,
    val tags: List<String>,
    val addedBy: String?,
)

fun XSound.toResponse(): XSoundResponse {
    return XSoundResponse(name = this.name, url = this.url, addedBy = this.addedBy, tags = this.tags)
}
