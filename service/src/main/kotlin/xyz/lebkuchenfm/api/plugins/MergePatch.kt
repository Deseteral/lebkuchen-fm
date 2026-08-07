package xyz.lebkuchenfm.api.plugins

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.getOrElse
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.request.contentType
import io.ktor.server.request.receive
import io.ktor.server.routing.Route
import io.ktor.server.routing.patch
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import xyz.lebkuchenfm.api.respondWithProblem
import xyz.lebkuchenfm.common.MergePatch
import xyz.lebkuchenfm.common.MergePatchError
import xyz.lebkuchenfm.common.MergePatchOptions

val MERGE_PATCH_CONTENT_TYPE = ContentType("application", "merge-patch+json")

/**
 * Reads the request body as an RFC 7396 JSON merge patch, applies it to [current] using the schema of `T`
 * (see [MergePatch]), and returns the merged result.
 *
 * Reads the body as raw bytes and parses it with [json] itself, bypassing ContentNegotiation, so validation
 * is fully under this helper's control. Malformed input and patch/schema mismatches are returned as [Err];
 * HTTP error mapping is left to the caller.
 */
suspend inline fun <reified T : Any> ApplicationCall.applyMergePatch(
    json: Json,
    current: T,
    options: MergePatchOptions = MergePatchOptions(),
): Result<T, MergePatchError> {
    val patchJson = try {
        json.parseToJsonElement(receive<ByteArray>().decodeToString()).jsonObject
    } catch (e: Exception) {
        return Err(MergePatchError.MalformedJson(e.message ?: "Body is not a valid JSON object."))
    }
    return MergePatch.merge(json, current, patchJson, options)
}

/**
 * Registers a `PATCH` route that applies an RFC 7396-style JSON merge patch to the resource provided by
 * [stateProvider], guided by the schema of `T`.
 *
 * - Accepts `Content-Type: application/merge-patch+json` (other content types yield `415`).
 * - The merge is performed with the passed [json] instance (the application's configured `Json`).
 * - [afterPatch] receives the original and the already-merged state, so callers can act on the difference.
 * - Invalid patches (malformed JSON, unknown fields, wrong value types, malformed nesting) yield `400`.
 */
inline fun <reified T : Any> Route.mergePatch(
    json: Json = Json,
    options: MergePatchOptions = MergePatchOptions(),
    crossinline stateProvider: suspend () -> T,
    crossinline afterPatch: suspend ApplicationCall.(origin: T, patched: T) -> Unit,
) {
    patch {
        if (!call.request.contentType().match(MERGE_PATCH_CONTENT_TYPE)) {
            call.respondWithProblem(
                title = "Unsupported Media Type",
                detail = "Expected Content-Type: application/merge-patch+json",
                status = HttpStatusCode.UnsupportedMediaType,
            )
            return@patch
        }

        val origin = stateProvider()
        val patched = call.applyMergePatch(json, origin, options).getOrElse { error ->
            call.respondWithProblem(
                title = "Invalid Request Body",
                detail = "Could not apply patch: ${error.message}",
                status = HttpStatusCode.BadRequest,
            )
            return@patch
        }

        call.afterPatch(origin, patched)
    }
}
