package xyz.lebkuchenfm.api

import io.ktor.http.HttpStatusCode
import kotlinx.serialization.Serializable

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
