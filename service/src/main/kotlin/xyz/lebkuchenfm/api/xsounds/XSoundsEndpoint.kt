package xyz.lebkuchenfm.api.xsounds

import com.github.michaelbull.result.getOrElse
import com.github.michaelbull.result.onFailure
import com.github.michaelbull.result.onSuccess
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.forEachPart
import io.ktor.server.request.receiveMultipart
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.api.getUserSession
import xyz.lebkuchenfm.api.plugins.withScopes
import xyz.lebkuchenfm.api.respondWithProblem
import xyz.lebkuchenfm.domain.auth.Scope
import xyz.lebkuchenfm.domain.xsounds.XSound
import xyz.lebkuchenfm.domain.xsounds.XSoundsService

fun Route.xSoundsRouting(xSoundsService: XSoundsService) {
    route("/x-sounds") {
        get {
            val sounds: List<XSound> = call.request.queryParameters["tag"]?.let { tag ->
                xSoundsService.getAllXSoundsWithTag(tag)
            } ?: xSoundsService.getAllXSounds()

            val response = XSoundsResponse(sounds.map { it.toResponse() })
            call.respond(response)
        }

        withScopes(Scope.XSOUNDS_UPLOAD) {
            post {
                val session = call.getUserSession()
                val parser = XSoundUploadParser()

                call.receiveMultipart().forEachPart { parser.handle(it) }

                val soundData = parser.build().getOrElse { error ->
                    when (error) {
                        is XSoundUploadError.InvalidSoundName -> {
                            call.respondWithProblem(
                                title = "Invalid sound name.",
                                detail = error.detail,
                                status = HttpStatusCode.BadRequest,
                            )
                        }
                        is XSoundUploadError.MissingFile -> {
                            call.respondWithProblem(
                                title = "Missing file.",
                                detail = "No file was provided in the request.",
                                status = HttpStatusCode.BadRequest,
                            )
                        }
                    }
                    return@post
                }

                xSoundsService.addNewXSound(soundData.soundName, soundData.tags, soundData.fileBytes, session)
                    .onSuccess {
                        call.respond(HttpStatusCode.Created, it.toResponse())
                    }
                    .onFailure { error ->
                        when (error) {
                            is XSoundsService.NewSoundError.SoundAlreadyExists -> {
                                call.respondWithProblem(
                                    title = "Sound already exists.",
                                    detail = "A sound with name '${soundData.soundName}' already exists.",
                                    status = HttpStatusCode.Conflict,
                                )
                            }
                            else -> {
                                call.respondWithProblem(
                                    title = "Could not create new x-sound.",
                                    detail = "An unexpected error occurred while creating the sound.",
                                    status = HttpStatusCode.InternalServerError,
                                )
                            }
                        }
                    }
            }
        }

        get("/tags") {
            val response = XSoundsTagsResponse(xSoundsService.findAllUniqueTags())
            call.respond(HttpStatusCode.OK, response)
        }
    }
}

@Serializable
data class XSoundsTagsResponse(val tags: List<String>)

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
