package xyz.lebkuchenfm.api.plugins

import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.request.contentType
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.patch
import kotlinx.serialization.KSerializer
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.serializer

/**
 * RFC 7396 JSON Merge Patch: Recursively merges [patch] into [target].
 *
 * - `null` in patch removes the key from the result.
 * - Missing keys in patch keep the target value.
 * - Non-object values in patch replace the target value wholesale.
 * - Arrays are replaced entirely (not merged).
 */
fun mergePatch(target: JsonElement?, patch: JsonElement): JsonElement {
    if (patch !is JsonObject) {
        return patch
    }

    val targetObj = target as? JsonObject ?: JsonObject(emptyMap())
    val result = targetObj.toMutableMap()

    for ((key, value) in patch) {
        if (value == JsonNull) {
            result.remove(key)
        } else {
            result[key] = mergePatch(result[key], value)
        }
    }

    return JsonObject(result)
}

val MERGE_PATCH_CONTENT_TYPE = ContentType("application", "merge-patch+json")

/**
 * Registers a PATCH route that applies an RFC 7396 JSON Merge Patch.
 *
 * Requires Content-Type: `application/merge-patch+json`. Returns 415 if missing.
 *
 * @param T Domain model type (e.g. [xyz.lebkuchenfm.domain.integrations.Integrations]).
 * @param json [Json] instance used for encoding/decoding [T].
 * @param stateReader Suspending function that returns the current state.
 * @param onMerged Callback receiving (oldState, newState) after the merge (both of type [T]).
 *   The receiver is [ApplicationCall].
 */
inline fun <reified T : Any> Route.mergePatchRoute(
    json: Json,
    crossinline stateReader: suspend () -> T,
    crossinline onMerged: suspend ApplicationCall.(oldState: T, newState: T) -> Unit,
) {
    val serializer: KSerializer<T> = serializer()

    patch {
        if (!call.request.contentType().match(MERGE_PATCH_CONTENT_TYPE)) {
            call.respond(
                HttpStatusCode.UnsupportedMediaType,
                "Expected Content-Type: application/merge-patch+json",
            )
            return@patch
        }

        val body = call.receive<ByteArray>().decodeToString()
        val patch = try {
            json.parseToJsonElement(body).jsonObject
        } catch (e: Exception) {
            call.respond(HttpStatusCode.BadRequest, "Invalid JSON body: ${e.message}")
            return@patch
        }
        val oldState = stateReader()
        val currentJson = json.encodeToJsonElement(serializer, oldState).jsonObject
        val mergedJson = mergePatch(currentJson, patch)
        val newState = json.decodeFromJsonElement(serializer, mergedJson)
        call.onMerged(oldState, newState)
    }
}
