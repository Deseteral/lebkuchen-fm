package xyz.lebkuchenfm.common

import com.github.michaelbull.result.getError
import com.github.michaelbull.result.getOrElse
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.test.assertTrue

@Serializable
private data class Nested(
    val inner: String? = null,
    val other: Int? = null,
)

@Serializable
private enum class Color { RED, GREEN }

@Serializable
private data class Container(
    val name: String? = null,
    val count: Int? = null,
    val flag: Boolean? = null,
    val nested: Nested? = null,
    val tags: List<String>? = null,
    val aliases: Map<String, String>? = null,
    val matrix: List<List<Int>>? = null,
    val roles: Set<String>? = null,
    val color: Color? = null,
)

@Serializable
private data class GraphNode(
    val name: String? = null,
    val children: List<GraphNode>? = null,
    val meta: Map<String, Nested>? = null,
)

class MergePatchTest {

    private val json = Json

    private fun deepNodePatch(depth: Int): String {
        var node = """{"name":"deep"}"""
        repeat(depth) {
            node = """{"children":[$node]}"""
        }
        return node
    }

    private fun deepestName(node: GraphNode?): String? {
        var current = node
        while (current?.children?.isNotEmpty()==true) {
            current = current.children.first()
        }
        return current?.name
    }

    @Test
    fun `string sets the field`() {
        // given
        val target = Container(name = "old")
        val patch = Json.parseToJsonElement(
            """{"name":"new"}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals("new", result.name)
    }

    @Test
    fun `number sets the field`() {
        // given
        val target = Container(count = 1)
        val patch = Json.parseToJsonElement(
            """{"count":2}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(2, result.count)
    }

    @Test
    fun `null clears the field`() {
        // given
        val target = Container(name = "old", count = 1)
        val patch = Json.parseToJsonElement(
            """{"name":null}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertNull(result.name)
        assertEquals(1, result.count)
    }

    @Test
    fun `absent key keeps current value`() {
        // given
        val target = Container(name = "old")
        val patch = Json.parseToJsonElement(
            """{"count":5}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals("old", result.name)
        assertEquals(5, result.count)
    }

    @Test
    fun `null patch value removes whole object field`() {
        // given
        val target = Container(nested = Nested(inner = "x"))
        val patch = Json.parseToJsonElement(
            """{"nested":null}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertNull(result.nested)
    }

    @Test
    fun `null current object plus object patch materializes the object`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"nested":{"inner":"x"}}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals("x", result.nested?.inner)
    }

    @Test
    fun `empty object patch on null object materializes an empty object`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"nested":{}}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(Nested(), result.nested)
    }

    @Test
    fun `unknown field throws by default`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"unknown":"x"}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.UnknownField)
    }

    @Test
    fun `unknown field inside object throws by default`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"nested":{"unknown":"x"}}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.UnknownField && error.path=="nested.unknown")
    }

    @Test
    fun `rejectUnknownFields false drops unknown keys`() {
        // given
        val target = Container(name = "old")
        val patch = Json.parseToJsonElement(
            """{"unknown":"x","name":"new"}""",
        ).jsonObject
        val options = MergePatchOptions(rejectUnknownFields = false)

        // when
        val result = MergePatch.merge(json, target, patch, options)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals("new", result.name)
    }

    @Test
    fun `object patch onto primitive field throws`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"name":{"x":"y"}}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType)
    }

    @Test
    fun `primitive patch onto object field throws`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"nested":"x"}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType)
    }

    @Test
    fun `number for string field is rejected`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"name":5}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType && error.path=="name")
    }

    @Test
    fun `string for number field is rejected`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"count":"abc"}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType && error.path=="count")
    }

    @Test
    fun `number for boolean field is rejected`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"flag":1}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType && error.path=="flag")
    }

    @Test
    fun `matching types merge successfully`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"name":"x","count":3,"flag":true}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals("x", result.name)
        assertEquals(3, result.count)
        assertEquals(true, result.flag)
    }

    @Test
    fun `maxDepth rejects object nesting beyond the cap`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"nested":{"inner":"x"}}""",
        ).jsonObject
        val options = MergePatchOptions(maxDepth = 0)

        // when
        val error = MergePatch.merge(json, target, patch, options)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.MaxDepthExceeded)
    }

    @Test
    fun `maxDepth allows nesting within the cap`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"nested":{"inner":"x"}}""",
        ).jsonObject
        val options = MergePatchOptions(maxDepth = 1)

        // when
        val result = MergePatch.merge(json, target, patch, options)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals("x", result.nested?.inner)
    }

    @Test
    fun `deep nesting beyond the schema throws`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"nested":{"inner":{"deep":"x"}}}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType)
    }

    @Test
    fun `list field is replaced by array patch`() {
        // given
        val target = Container(tags = listOf("a"))
        val patch = Json.parseToJsonElement(
            """{"tags":["x","y"]}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(listOf("x", "y"), result.tags)
    }

    @Test
    fun `list field is set when currently null`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"tags":["x"]}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(listOf("x"), result.tags)
    }

    @Test
    fun `list field is cleared by null`() {
        // given
        val target = Container(tags = listOf("a"))
        val patch = Json.parseToJsonElement(
            """{"tags":null}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertNull(result.tags)
    }

    @Test
    fun `primitive for list field is rejected`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"tags":"x"}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType)
    }

    @Test
    fun `object for list field is rejected`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"tags":{"a":"b"}}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType)
    }

    @Test
    fun `array for scalar field is rejected`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"name":["x"]}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType)
    }

    @Test
    fun `array for object field is rejected`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"nested":["x"]}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType)
    }

    @Test
    fun `array with wrong element type is rejected`() {
        // given
        val target = Container(tags = listOf("a"))
        val patch = Json.parseToJsonElement(
            """{"tags":[1,2]}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType && error.path=="tags[0]")
    }

    @Test
    fun `array with unknown field element is rejected`() {
        // given
        val target = Container(tags = listOf("a"))
        val patch = Json.parseToJsonElement(
            """{"tags":[{"unknown":"x"}]}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType)
    }

    @Test
    fun `set field is replaced by array patch`() {
        // given
        val target = Container(roles = setOf("a"))
        val patch = Json.parseToJsonElement(
            """{"roles":["x","y"]}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(setOf("x", "y"), result.roles)
    }

    @Test
    fun `set field is set when currently null`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"roles":["x","x"]}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(setOf("x"), result.roles)
    }

    @Test
    fun `set field is cleared by null`() {
        // given
        val target = Container(roles = setOf("a"))
        val patch = Json.parseToJsonElement(
            """{"roles":null}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertNull(result.roles)
    }

    @Test
    fun `set collapses duplicate elements after replace`() {
        // given
        val target = Container(roles = setOf("x"))
        val patch = Json.parseToJsonElement(
            """{"roles":["a","a","b"]}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(setOf("a", "b"), result.roles)
    }

    @Test
    fun `set with wrong element type is rejected`() {
        // given
        val target = Container(roles = setOf("a"))
        val patch = Json.parseToJsonElement(
            """{"roles":[1,2]}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType && error.path=="roles[0]")
    }

    @Test
    fun `object for set field is rejected`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"roles":{"a":"b"}}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType)
    }

    @Test
    fun `valid enum member sets the field`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"color":"RED"}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(Color.RED, result.color)
    }

    @Test
    fun `enum member persists when patch is null`() {
        // given
        val target = Container(color = Color.GREEN)
        val patch = Json.parseToJsonElement(
            """{"name":"x"}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(Color.GREEN, result.color)
    }

    @Test
    fun `invalid enum member is rejected with path`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"color":"PURPLE"}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.DecodeFailed && error.path=="color")
    }

    @Test
    fun `nested list of lists is replaced`() {
        // given
        val target = Container(matrix = listOf(listOf(1)))
        val patch = Json.parseToJsonElement(
            """{"matrix":[[2,3]]}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(listOf(listOf(2, 3)), result.matrix)
    }

    @Test
    fun `nested list of nodes is replaced`() {
        // given
        val target = GraphNode(children = listOf(GraphNode(name = "a")))
        val patch = Json.parseToJsonElement(
            """{"children":[{"name":"b"}]}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(listOf(GraphNode(name = "b")), result.children)
    }

    @Test
    fun `node at depth is modifiable through nested arrays`() {
        // given
        val target = GraphNode()
        val patch = Json.parseToJsonElement(
            deepNodePatch(7),
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals("deep", deepestName(result))
    }

    @Test
    fun `maxDepth rejects deep array nesting for recursive types`() {
        // given
        val target = GraphNode()
        val patch = Json.parseToJsonElement(
            deepNodePatch(6),
        ).jsonObject
        val options = MergePatchOptions(maxDepth = 3)

        // when
        val error = MergePatch.merge(json, target, patch, options)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.MaxDepthExceeded)
    }

    @Test
    fun `maxDepth allows shallow list`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"tags":["a","b"]}""",
        ).jsonObject
        val options = MergePatchOptions(maxDepth = 2)

        // when
        val result = MergePatch.merge(json, target, patch, options)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(listOf("a", "b"), result.tags)
    }

    @Test
    fun `map field merges entries`() {
        // given
        val target = Container(aliases = mapOf("a" to "1"))
        val patch = Json.parseToJsonElement(
            """{"aliases":{"b":"2"}}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(mapOf("a" to "1", "b" to "2"), result.aliases)
    }

    @Test
    fun `map null member removes the entry`() {
        // given
        val target = Container(aliases = mapOf("a" to "1", "b" to "2"))
        val patch = Json.parseToJsonElement(
            """{"aliases":{"a":null}}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(mapOf("b" to "2"), result.aliases)
    }

    @Test
    fun `map field is set when currently null`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"aliases":{"x":"1"}}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(mapOf("x" to "1"), result.aliases)
    }

    @Test
    fun `map wrong value type is rejected`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"aliases":{"a":5}}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType && error.path=="aliases.a")
    }

    @Test
    fun `array for map field is rejected`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"aliases":["a"]}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType)
    }

    @Test
    fun `map value object merges`() {
        // given
        val target = GraphNode(meta = mapOf("k" to Nested(inner = "old")))
        val patch = Json.parseToJsonElement(
            """{"meta":{"k":{"inner":"new"}}}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(Nested(inner = "new"), result.meta?.get("k"))
    }

    @Test
    fun `error message includes nested path for unknown field`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"nested":{"unknown":"x"}}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.UnknownField && error.path=="nested.unknown")
        assertTrue(error.message.contains("nested.unknown"))
    }

    @Test
    fun `error message includes nested path for object into scalar`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"nested":{"inner":{"x":"y"}}}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType && error.path=="nested.inner")
        assertTrue(error.message.contains("nested.inner"))
    }

    @Test
    fun `error message includes path for array into object field`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"nested":["x"]}""",
        ).jsonObject

        // when
        val error = MergePatch.merge(json, target, patch)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.InvalidType && error.path=="nested")
        assertTrue(error.message.contains("nested"))
    }

    @Test
    fun `empty object patch on populated target is a no-op`() {
        // given
        val original = Container(name = "x", count = 3, nested = Nested(inner = "y"), tags = listOf("a"))
        val patch = Json.parseToJsonElement(
            """{}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, original, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(original, result)
    }

    @Test
    fun `nested object patch merges into existing object preserving sibling fields`() {
        // given
        val target = Container(nested = Nested(inner = "old", other = 1))
        val patch = Json.parseToJsonElement(
            """{"nested":{"inner":"new"}}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(Nested(inner = "new", other = 1), result.nested)
    }

    @Test
    fun `null inside nested object clears the nested field but keeps the object`() {
        // given
        val target = Container(nested = Nested(inner = "x", other = 1))
        val patch = Json.parseToJsonElement(
            """{"nested":{"inner":null}}""",
        ).jsonObject

        // when
        val result = MergePatch.merge(json, target, patch)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals(Nested(other = 1), result.nested)
    }

    @Test
    fun `maxFields rejects patch with too many fields`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"name":"a","count":1,"flag":true,"color":"RED"}""",
        ).jsonObject
        val options = MergePatchOptions(maxFields = 3)

        // when
        val error = MergePatch.merge(json, target, patch, options)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.MaxFieldsExceeded)
    }

    @Test
    fun `maxFields allows patch within limit`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"name":"a","count":1}""",
        ).jsonObject
        val options = MergePatchOptions(maxFields = 3)

        // when
        val result = MergePatch.merge(json, target, patch, options)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals("a", result.name)
        assertEquals(1, result.count)
    }

    @Test
    fun `maxFields checks nested object field count`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"nested":{"inner":"a","other":1,"extra":true}}""",
        ).jsonObject
        val options = MergePatchOptions(maxFields = 2)

        // when
        val error = MergePatch.merge(json, target, patch, options)
            .getError() ?: throw AssertionError("Expected error")

        // then
        assertTrue(error is MergePatchError.MaxFieldsExceeded && error.path=="nested")
    }

    @Test
    fun `maxFields null disables check`() {
        // given
        val target = Container()
        val patch = Json.parseToJsonElement(
            """{"name":"a","count":1,"flag":true,"color":"RED"}""",
        ).jsonObject
        val options = MergePatchOptions(maxFields = null)

        // when
        val result = MergePatch.merge(json, target, patch, options)
            .getOrElse { error -> throw AssertionError("Expected success, got $error") }

        // then
        assertEquals("a", result.name)
    }
}
