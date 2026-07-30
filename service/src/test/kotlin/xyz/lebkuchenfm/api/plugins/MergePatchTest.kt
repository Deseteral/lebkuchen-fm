package xyz.lebkuchenfm.api.plugins

import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
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
        val expected = Json.parseToJsonElement("""{"a": 1}""")
        assertEquals(expected, result)
    }

    @Test
    fun `missing keys pass through unchanged`() {
        // given
        val target = Json.parseToJsonElement("""{"a": 1}""").jsonObject
        val patch = Json.parseToJsonElement("""{"b": 2}""").jsonObject

        // when
        val result = mergePatch(target, patch)

        // then
        val expected = Json.parseToJsonElement("""{"a": 1, "b": 2}""")
        assertEquals(expected, result)
    }

    @Test
    fun `non-object value replaces nested object entirely`() {
        // given
        val target = Json.parseToJsonElement("""{"a": {"nested": 1}}""").jsonObject
        val patch = Json.parseToJsonElement("""{"a": 2}""").jsonObject

        // when
        val result = mergePatch(target, patch)

        // then
        val expected = Json.parseToJsonElement("""{"a": 2}""")
        assertEquals(expected, result)
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
        // given
        val target: JsonElement? = null
        val patch = Json.parseToJsonElement("""{"a": 1}""").jsonObject

        // when
        val result = mergePatch(target, patch)

        // then
        val expected = Json.parseToJsonElement("""{"a": 1}""")
        assertEquals(expected, result)
    }

    @Test
    fun `non-object patch on null target returns the patch`() {
        // given
        val target: JsonElement? = null
        val patch = JsonPrimitive("hello")

        // when
        val result = mergePatch(target, patch)

        // then
        assertEquals(patch, result)
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

        // then
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
        val expected = Json.parseToJsonElement("""{"a": [3]}""")
        assertEquals(expected, result)
    }

    @Test
    fun `null patch replaces entire target with null`() {
        // given
        val target = Json.parseToJsonElement("""{"a": "foo"}""").jsonObject
        val patch: JsonElement = JsonNull

        // when
        val result = mergePatch(target, patch)

        // then
        assertEquals(JsonNull, result)
    }

    @Test
    fun `non-object patch replaces object target`() {
        // given
        val target = Json.parseToJsonElement("""{"a": "foo"}""").jsonObject
        val patch = Json.parseToJsonElement("""["c"]""")

        // when
        val result = mergePatch(target, patch)

        // then
        val expected = Json.parseToJsonElement("""["c"]""")
        assertEquals(expected, result)
    }

    @Test
    fun `non-object target replaced by object patch`() {
        // given
        val target: JsonElement = Json.parseToJsonElement("""["a", "b"]""")
        val patch = Json.parseToJsonElement("""{"a": "c"}""").jsonObject

        // when
        val result = mergePatch(target, patch)

        // then
        val expected = Json.parseToJsonElement("""{"a": "c"}""")
        assertEquals(expected, result)
    }

    @Test
    fun `explicit null value in target preserved when patch adds new key`() {
        // given
        val target = Json.parseToJsonElement("""{"e": null}""").jsonObject
        val patch = Json.parseToJsonElement("""{"a": 1}""").jsonObject

        // when
        val result = mergePatch(target, patch)

        // then
        val expected = Json.parseToJsonElement("""{"e": null, "a": 1}""")
        assertEquals(expected, result)
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

        // then
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
        assertEquals(expected, result)
    }
}
