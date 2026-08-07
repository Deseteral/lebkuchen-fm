package xyz.lebkuchenfm.common

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.andThen
import com.github.michaelbull.result.getOrElse
import kotlinx.serialization.KSerializer
import kotlinx.serialization.SerializationException
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.descriptors.SerialKind
import kotlinx.serialization.descriptors.StructureKind
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.serializer

/**
 * Configuration for [MergePatch].
 *
 * - [rejectUnknownFields]: `true` fails on keys not present in the target schema, `false` silently drops them.
 * - [maxDepth]: cap on recursive structural nesting (objects into composite/map fields and array element
 *   levels). `null` is unbounded. Recursion is always bounded by the schema for finite trees; set a cap for
 *   recursive schemas (e.g. self-referencing nodes) so a hostile deep patch is rejected before it is decoded.
 */
data class MergePatchOptions(
    val rejectUnknownFields: Boolean = true,
    val maxDepth: Int? = 32,
    val maxFields: Int? = 1000,
)

/**
 * Why a merge patch was rejected. [message] is a human-readable description that includes the offending
 * JsonPath where available (e.g. `address.city` or `addresses[2].postcode`).
 */
sealed interface MergePatchError {
    val message: String

    /** A key in the patch is not present in the target schema. */
    data class UnknownField(val path: String) : MergePatchError {
        override val message: String = "Unknown field $path"
    }

    /** A patch value has a JSON type the target field cannot accept (object into scalar, array into object, ...). */
    data class InvalidType(val path: String, val expected: ExpectedKind) : MergePatchError {
        override val message: String = "Expected a ${expected.name.lowercase()} at $path"
    }

    enum class ExpectedKind {
        OBJECT,
        ARRAY,
        VALUE,
    }

    /** The patch nests deeper than [MergePatchOptions.maxDepth] allows. */
    data class MaxDepthExceeded(val path: String, val maxDepth: Int) : MergePatchError {
        override val message: String = "Merge patch nesting exceeds maximum depth of $maxDepth."
    }

    /** The patch object has more fields than [MergePatchOptions.maxFields] allows. */
    data class MaxFieldsExceeded(val path: String, val maxFields: Int) : MergePatchError {
        override val message: String = "Merge patch object exceeds maximum field count of $maxFields."
    }

    /** The merged result could not be decoded against the schema (e.g. wrong list element type). */
    data class DecodeFailed(val path: String?, val detail: String) : MergePatchError {
        override val message: String = detail
    }

    /** The request body could not be parsed as a JSON object. */
    data class MalformedJson(val detail: String) : MergePatchError {
        override val message: String = "Malformed JSON: $detail"
    }
}

/**
 * Applies an RFC 7396-style JSON merge patch to a typed object, guided by its [KSerializer] descriptor.
 *
 * Wire semantics:
 * - key omitted            -> keeps the currently stored value
 * - JSON `null`            -> clears the stored value / removes the map entry
 * - JSON string/number/boolean -> sets the stored value
 * - nested JSON object     -> merges into the composite field or map (an absent/null current value is treated as `{}`)
 * - JSON array             -> replaces the list field; each element is still validated against the schema
 *
 * The passed [Json] instance (encode/decode settings, serializers module, custom serializers) is used for both
 * the baseline encode and the final strict decode, so the merge behaves identically to the rest of the app.
 *
 * Clearing semantics for `null`/removed keys come from kotlinx.serialization during the final decode:
 * a nullable property becomes `null`, an optional property keeps its default, and a required non-null
 * property that was `null`-patched is rejected by decoding.
 *
 * Example: [merge] a partial `{ "group": null }` patch into the current value to clear `group`.
 * Call the reified overload to let kotlinx.serialization resolve the [KSerializer].
 *
 * Invalid input (unknown fields, wrong value types, malformed nesting) is returned as [Err] with a
 * [MergePatchError]; error messages include the offending JsonPath (e.g. `address.city` or
 * `addresses[2].postcode`).
 */
object MergePatch {
    fun <T> merge(
        json: Json,
        target: T,
        serializer: KSerializer<T>,
        patch: JsonObject,
        options: MergePatchOptions = MergePatchOptions(),
    ): Result<T, MergePatchError> {
        val baseline = json.encodeToJsonElement(serializer, target).jsonObject
        return mergeObject(serializer.descriptor, baseline, patch, options, JsonPath(), depth = 0)
            .andThen { merged -> decodeMerged(json, serializer, merged) }
    }

    private fun <T> decodeMerged(
        json: Json,
        serializer: KSerializer<T>,
        merged: JsonObject,
    ): Result<T, MergePatchError> = try {
        Ok(json.decodeFromJsonElement(serializer, merged))
    } catch (e: SerializationException) {
        Err(MergePatchError.DecodeFailed(null, e.message ?: "Could not decode the merged value."))
    }

    inline fun <reified T : Any> merge(
        json: Json,
        target: T,
        patch: JsonObject,
        options: MergePatchOptions = MergePatchOptions(),
    ): Result<T, MergePatchError> = merge(json, target, serializer(), patch, options)

    private fun mergeObject(
        descriptor: SerialDescriptor,
        current: JsonObject,
        patch: JsonObject,
        options: MergePatchOptions,
        path: JsonPath,
        depth: Int,
    ): Result<JsonObject, MergePatchError> {
        return mergeEntries(
            current = current,
            patch = patch,
            options = options,
            path = path,
            depth = depth,
        ) { key ->
            val index = descriptor.getElementIndex(key)

            if (index < 0) {
                null
            } else {
                descriptor.getElementDescriptor(index)
            }
        }
    }

    private fun mergeList(
        descriptor: SerialDescriptor,
        patch: JsonArray,
        options: MergePatchOptions,
        path: JsonPath,
        depth: Int,
    ): Result<JsonElement, MergePatchError> {
        checkDepth(options, path, depth)?.let { return Err(it) }

        if (descriptor.elementsCount == 0) {
            return Err(
                MergePatchError.DecodeFailed(
                    path.toString(),
                    "Cannot determine list element type.",
                ),
            )
        }

        val elementDescriptor = descriptor.getElementDescriptor(0)
        val result = ArrayList<JsonElement>(patch.size)

        for ((index, element) in patch.withIndex()) {
            val merged = mergeElement(
                descriptor = elementDescriptor,
                existingValue = null,
                patchValue = element,
                options = options,
                path = path.index(index),
                depth = depth,
            ).getOrElse { return Err(it) }

            result += merged
        }

        return Ok(JsonArray(result))
    }

    private fun mergeEntries(
        current: JsonObject,
        patch: JsonObject,
        options: MergePatchOptions,
        path: JsonPath,
        depth: Int,
        descriptorForKey: (String) -> SerialDescriptor?,
    ): Result<JsonObject, MergePatchError> {
        checkDepth(options, path, depth)?.let { return Err(it) }
        checkMaxFields(options, path, patch.size)?.let { return Err(it) }

        val result = current.toMutableMap()

        for ((key, value) in patch) {
            val childPath = path.child(key)

            if (value is JsonNull) {
                result.remove(key)
                continue
            }

            val descriptor = descriptorForKey(key)

            if (descriptor == null) {
                if (options.rejectUnknownFields) {
                    return Err(MergePatchError.UnknownField(childPath.toString()))
                }
                continue
            }

            result[key] = mergeElement(
                descriptor = descriptor,
                existingValue = result[key],
                patchValue = value,
                options = options,
                path = childPath,
                depth = depth,
            ).getOrElse { return Err(it) }
        }

        return Ok(JsonObject(result))
    }

    private val SerialDescriptor.isList: Boolean
        get() = kind == StructureKind.LIST

    private fun mergeElement(
        descriptor: SerialDescriptor,
        existingValue: JsonElement?,
        patchValue: JsonElement,
        options: MergePatchOptions,
        path: JsonPath,
        depth: Int,
    ): Result<JsonElement, MergePatchError> = when (patchValue) {
        JsonNull -> Ok(JsonNull)

        is JsonObject -> mergeObjectValue(
            descriptor = descriptor,
            existingValue = existingValue,
            patch = patchValue,
            options = options,
            path = path,
            depth = depth,
        )

        is JsonArray -> if (descriptor.isList) {
            mergeList(
                descriptor,
                patchValue,
                options,
                path,
                depth + 1,
            )
        } else {
            invalid(path, MergePatchError.ExpectedKind.ARRAY)
        }

        is JsonPrimitive -> validatePrimitive(
            descriptor = descriptor,
            path = path,
            value = patchValue,
        )
    }

    private fun mergeObjectValue(
        descriptor: SerialDescriptor,
        existingValue: JsonElement?,
        patch: JsonObject,
        options: MergePatchOptions,
        path: JsonPath,
        depth: Int,
    ): Result<JsonElement, MergePatchError> = when (descriptor.kind) {
        is StructureKind.CLASS -> mergeObject(
            descriptor,
            existingValue.jsonObjectOrEmpty(),
            patch,
            options,
            path,
            depth + 1,
        )

        is StructureKind.MAP -> mergeEntries(
            current = existingValue.jsonObjectOrEmpty(),
            patch = patch,
            options = options,
            path = path,
            depth = depth + 1,
            descriptorForKey = { descriptor.getElementDescriptor(1) },
        )

        else -> invalid(path, MergePatchError.ExpectedKind.OBJECT)
    }

    private fun validatePrimitive(
        descriptor: SerialDescriptor,
        path: JsonPath,
        value: JsonPrimitive,
    ): Result<JsonElement, MergePatchError> {
        return when (val kind = descriptor.kind) {
            SerialKind.ENUM -> validateEnumMember(descriptor, path, value)

            is PrimitiveKind -> if (primitiveCompatible(kind, value)) {
                Ok(value)
            } else {
                invalid(path, MergePatchError.ExpectedKind.VALUE)
            }

            is StructureKind -> invalid(path, MergePatchError.ExpectedKind.VALUE)

            else -> Ok(value)
        }
    }

    private fun validateEnumMember(
        descriptor: SerialDescriptor,
        path: JsonPath,
        value: JsonPrimitive,
    ): Result<JsonElement, MergePatchError> {
        val text = value.content
        val valid = (0 until descriptor.elementsCount).any { descriptor.getElementName(it) == text }

        return if (valid) {
            Ok(value)
        } else {
            Err(
                MergePatchError.DecodeFailed(
                    path = path.toString(),
                    detail = "Enum ${descriptor.serialName} does not contain element with name '$text' at $path",
                ),
            )
        }
    }

    private fun primitiveCompatible(kind: PrimitiveKind, value: JsonPrimitive): Boolean = when (kind) {
        PrimitiveKind.STRING -> value.isString
        PrimitiveKind.BOOLEAN -> !value.isString && value.content.toBooleanStrictOrNull() != null
        PrimitiveKind.BYTE -> value.content.toByteOrNull() != null
        PrimitiveKind.SHORT -> value.content.toShortOrNull() != null
        PrimitiveKind.INT -> value.content.toIntOrNull() != null
        PrimitiveKind.LONG -> value.content.toLongOrNull() != null
        PrimitiveKind.FLOAT -> value.content.toFloatOrNull() != null
        PrimitiveKind.DOUBLE -> value.content.toDoubleOrNull() != null

        PrimitiveKind.CHAR -> value.isString && value.content.length == 1
    }

    private fun checkDepth(options: MergePatchOptions, path: JsonPath, depth: Int): MergePatchError? =
        if (options.maxDepth != null && depth > options.maxDepth) {
            MergePatchError.MaxDepthExceeded(path.toString(), options.maxDepth)
        } else {
            null
        }

    private fun checkMaxFields(options: MergePatchOptions, path: JsonPath, fieldCount: Int): MergePatchError? =
        if (options.maxFields != null && fieldCount > options.maxFields) {
            MergePatchError.MaxFieldsExceeded(path.toString(), options.maxFields)
        } else {
            null
        }

    private fun invalid(path: JsonPath, expected: MergePatchError.ExpectedKind): Result<JsonElement, MergePatchError> =
        Err(MergePatchError.InvalidType(path.toString(), expected))

    private fun JsonElement?.jsonObjectOrEmpty(): JsonObject = this as? JsonObject ?: JsonObject(emptyMap())

    @JvmInline
    private value class JsonPath(private val value: String = "") {
        fun child(name: String): JsonPath = JsonPath(if (value.isEmpty()) name else "$value.$name")

        fun index(i: Int): JsonPath = JsonPath("$value[$i]")

        override fun toString(): String = value
    }
}
