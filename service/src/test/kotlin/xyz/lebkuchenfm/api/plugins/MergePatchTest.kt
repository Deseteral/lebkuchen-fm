package xyz.lebkuchenfm.api.plugins

import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.jsonObject
import kotlin.test.Test
import kotlin.test.assertEquals

class MergePatchTest {

    @Test
    fun `null in patch removes key`() {
        // given
        val target = Json.parseToJsonElement("""{"a": 1, "b": 2}""").jsonObject
        val patch = Json.parseToJsonElement("""{"b": null}""").jsonObject

        // when
        val result = mergePatch(target, patch)

        // then
        assertEquals(Json.parseToJsonElement("""{"a": 1}"""), result)
    }

    @Test
    fun `missing keys pass through unchanged`() {
        // given
        val target = Json.parseToJsonElement("""{"a": 1}""").jsonObject
        val patch = Json.parseToJsonElement("""{"b": 2}""").jsonObject

        // when
        val result = mergePatch(target, patch)

        // then
        assertEquals(
            Json.parseToJsonElement("""{"a": 1, "b": 2}"""),
            result,
        )
    }

    @Test
    fun `non-object value replaces nested object entirely`() {
        // given
        val target = Json.parseToJsonElement("""{"a": {"nested": 1}}""").jsonObject
        val patch = Json.parseToJsonElement("""{"a": 2}""").jsonObject

        // when
        val result = mergePatch(target, patch)

        // then
        assertEquals(Json.parseToJsonElement("""{"a": 2}"""), result)
    }

    @Test
    fun `empty patch returns target unchanged`() {
        // given
        val target = Json.parseToJsonElement("""{"a": 1}""").jsonObject
        val patch = Json.parseToJsonElement("""{}""").jsonObject

        // when
        val result = mergePatch(target, patch)

        // then
        assertEquals(target, result)
    }

    @Test
    fun `null target is replaced by patch`() {
        // when
        val result = mergePatch(null, Json.parseToJsonElement("""{"a": 1}""").jsonObject)

        // then
        assertEquals(Json.parseToJsonElement("""{"a": 1}"""), result)
    }

    @Test
    fun `non-object patch on null target returns the patch`() {
        // when
        val result = mergePatch(null, JsonPrimitive("hello"))

        // then
        assertEquals(JsonPrimitive("hello"), result)
    }

    @Test
    fun `nested objects merge recursively`() {
        // given
        val target = Json.parseToJsonElement(
            """
            {
                "a": {
                    "x": 1,
                    "y": 2
                }
            }
            """,
        ).jsonObject
        val patch = Json.parseToJsonElement(
            """
            {
                "a": {
                    "y": 3,
                    "z": 4
                }
            }
            """,
        ).jsonObject

        // when
        val result = mergePatch(target, patch)
        val expected = Json.parseToJsonElement(
            """
            {
                "a": {
                    "x": 1,
                    "y": 3,
                    "z": 4
                }
            }
            """,
        )

        // then
        assertEquals(expected, result)
    }

    @Test
    fun `arrays are replaced entirely not merged`() {
        // given
        val target = Json.parseToJsonElement("""{"a": [1, 2]}""").jsonObject
        val patch = Json.parseToJsonElement("""{"a": [3]}""").jsonObject

        // when
        val result = mergePatch(target, patch)

        // then
        assertEquals(Json.parseToJsonElement("""{"a": [3]}"""), result)
    }

    @Test
    fun `null in nested patch removes deeply nested key`() {
        // given
        val target = Json.parseToJsonElement(
            """
            {
                "a": {
                    "b": {
                        "c": 1,
                        "d": 2
                    }
                }
            }
            """,
        ).jsonObject
        val patch = Json.parseToJsonElement(
            """
            {
                "a": {
                    "b": {
                        "c": null
                    }
                }
            }
            """,
        ).jsonObject

        // when
        val result = mergePatch(target, patch)
        val expected = Json.parseToJsonElement(
            """
            {
                "a": {
                    "b": {
                        "d": 2
                    }
                }
            }
            """,
        )

        // then
        assertEquals(expected, result)
    }
}
