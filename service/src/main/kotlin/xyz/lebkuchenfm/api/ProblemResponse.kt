package xyz.lebkuchenfm.api

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.request.uri
import kotlinx.serialization.Serializable
import io.ktor.server.response.respond

/*
 * Response body for errors based on RFC 9457.
 */

data class ProblemResponse(
    val title: String,
    val detail: String,
    val status: HttpStatusCode,
    val instance: String,
)

@Serializable
data class ProblemResponseDto(
    val title: String,
    val detail: String,
    val status: Int,
    val instance: String,
)

fun ProblemResponse.toDto(): ProblemResponseDto = ProblemResponseDto(title, detail, status.value, instance)

suspend fun ApplicationCall.respondWithProblem(title: String, detail: String, status: HttpStatusCode) {
    val problem = ProblemResponse(
        title = title,
        detail = detail,
        status = status,
        this.request.uri,
    )
    this.respond(status, problem.toDto())
}
