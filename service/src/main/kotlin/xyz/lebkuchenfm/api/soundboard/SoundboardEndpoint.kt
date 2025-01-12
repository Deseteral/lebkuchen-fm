package xyz.lebkuchenfm.api.soundboard

import com.github.michaelbull.result.onFailure
import com.github.michaelbull.result.onSuccess
import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import xyz.lebkuchenfm.api.respondWithProblem
import xyz.lebkuchenfm.domain.soundboard.SoundboardService

fun Route.soundboardEndpoint(soundboardService: SoundboardService) {
    route("/soundboard") {
        post("/play") {
            val soundName = call.request.queryParameters["soundName"] ?: run {
                call.respondWithProblem(
                    title = "Missing soundName parameter.",
                    detail = "You have to provide a sound name to play.",
                    status = HttpStatusCode.BadRequest,
                )
                return@post
            }

            soundboardService.playXSound(soundName)
                .onSuccess {
                    call.respond(HttpStatusCode.Accepted)
                }
                .onFailure { error ->
                    when (error) {
                        SoundboardService.PlayXSoundError.SoundNotFound -> {
                            call.respondWithProblem(
                                title = "Sound does not exist",
                                detail = "Sound $soundName does not exist.",
                                status = HttpStatusCode.NotFound,
                            )
                        }
                    }
                }
        }
    }
}
