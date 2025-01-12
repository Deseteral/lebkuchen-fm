package xyz.lebkuchenfm.api.soundboard

import com.github.michaelbull.result.onFailure
import com.github.michaelbull.result.onSuccess
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.uri
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import xyz.lebkuchenfm.api.ProblemResponse
import xyz.lebkuchenfm.api.toDto
import xyz.lebkuchenfm.domain.soundboard.SoundboardService
import io.ktor.server.response.respond

fun Route.soundboardEndpoint(soundboardService: SoundboardService) {
    route("/soundboard") {
        post("/play") {
            val soundName = call.request.queryParameters["soundName"] ?: run {
                val status = HttpStatusCode.BadRequest
                val problem = ProblemResponse(
                    title = "Missing soundName parameter.",
                    detail = "You have to provide a sound name to play.",
                    status = status,
                    call.request.uri,
                )
                call.respond(status, problem.toDto())
                return@post
            }

            soundboardService.playXSound(soundName)
                .onSuccess {
                    call.respond(HttpStatusCode.Accepted)
                }
                .onFailure { error ->
                    when (error) {
                        SoundboardService.PlayXSoundError.SoundNotFound -> {
                            val status = HttpStatusCode.NotFound
                            val problem = ProblemResponse(
                                title = "Sound does not exist",
                                detail = "Sound $soundName does not exist.",
                                status = status,
                                call.request.uri,
                            )
                            call.respond(status, problem.toDto())
                        }
                    }
                }
        }
    }
}
