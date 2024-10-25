package xyz.lebkuchenfm.api.xsounds

import io.ktor.http.HttpStatusCode
import io.ktor.http.content.PartData
import io.ktor.http.content.forEachPart
import io.ktor.server.request.receiveMultipart
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import io.ktor.utils.io.readRemaining
import kotlinx.io.readByteArray
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.xsounds.XSound
import xyz.lebkuchenfm.domain.xsounds.XSoundsService
import xyz.lebkuchenfm.external.storage.FileStorage
import xyz.lebkuchenfm.external.storage.Storage
import java.io.File
import java.util.UUID

fun Route.xSoundsRouting(
    xSoundsService: XSoundsService,
    fileStorage: FileStorage,
) {
    route("/x-sounds") {
        get {
            val sounds = xSoundsService.getAllXSounds()
            val response = XSoundsResponse(sounds.map { it.toResponse() })
            call.respond(response)
        }

        get("/tags") {
        }

        post {
            var soundName = ""
            var tagsString = ""
            var fileName = UUID.randomUUID().toString()
            val multipartData = call.receiveMultipart()
            var fileBytes: ByteArray? = null

            multipartData.forEachPart { part ->
                when (part) {
                    is PartData.FormItem -> {
                        if (part.name == "soundName") {
                            // TODO: check if soundName provided and valid
                            soundName = part.value
                        } else if (part.name == "tags") {
                            // TODO: parse tags
                            tagsString = part.value
                        }
                    }

                    is PartData.FileItem -> {
                        part.originalFileName?.let { fileName = it }
                        fileBytes = part.provider().readRemaining().readByteArray()
                    }

                    else -> {}
                }
                part.dispose()
            }

            fileBytes?.let { bytes ->
                val extension = File(fileName).extension.takeIf { it.isNotBlank() }.run { ".$this" }
                val result = fileStorage.uploadFile(Storage.XSound, "$soundName$extension", bytes)
                if (result.isSuccess) {
                    call.respondText("$fileName is uploaded as '$soundName' with tags: $tagsString")
                    // TODO: save file url to mongo
                } else {
                    call.respond(HttpStatusCode.InternalServerError)
                }
            }
        }
    }
}

@Serializable
data class XSoundsResponse(val sounds: List<XSoundResponse>)

@Serializable
data class XSoundResponse(
    val id: String,
    val name: String,
)

fun XSound.toResponse(): XSoundResponse {
    return XSoundResponse(id = this.id, name = this.name)
}
