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
            var tags: List<String> = emptyList()
            var fileName = UUID.randomUUID().toString()
            val multipartData = call.receiveMultipart()
            var fileBytes: ByteArray? = null

            multipartData.forEachPart { part ->
                when (part) {
                    is PartData.FormItem -> {
                        if (part.name == "soundName") {
                            // TODO: check if provided soundName is valid
                            soundName = part.value
                        } else if (part.name == "tags") {
                            tags = part.value.split(',').map { it.trim() }
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
                val result = fileStorage.uploadFile(Storage.XSound, "$soundName$extension", bytes).getOrNull()
                if (result != null) {
                    // TODO: pass authenticated user name
                    val newSound = XSound(name = soundName, url = result.publicUrl, addedBy = "beta_dev", tags = tags)
                    xSoundsService.addNewXSound(newSound)
                    call.respond(HttpStatusCode.Created, "Created {${newSound.name}: ${newSound.url}}")
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
    val name: String,
    val url: String,
    val tags: List<String>,
    val addedBy: String?,
)

fun XSound.toResponse(): XSoundResponse {
    return XSoundResponse(name = this.name, url = this.url, addedBy = this.addedBy, tags = this.tags)
}
