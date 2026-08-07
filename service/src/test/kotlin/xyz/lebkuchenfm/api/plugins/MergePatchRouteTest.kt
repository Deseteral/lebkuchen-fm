package xyz.lebkuchenfm.api.plugins

import io.ktor.client.request.patch
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.response.respondText
import io.ktor.server.routing.routing
import io.ktor.server.testing.testApplication
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import xyz.lebkuchenfm.common.MergePatchOptions
import kotlin.test.Test
import kotlin.test.assertEquals

@Serializable
private data class Address(
    val street: String? = null,
    val city: String? = null,
)

@Serializable
private data class Pet(
    val name: String? = null,
    val age: Int? = null,
    val address: Address? = null,
    val tags: List<String>? = null,
)

class MergePatchRouteTest {

    @Test
    fun `returns 415 when Content-Type is not merge-patch-json`() = testApplication {
        install(ContentNegotiation) { json() }
        routing {
            mergePatch(
                stateProvider = { Pet("Buddy", 3) },
                afterPatch = { _, _ -> respondText("ok") },
            )
        }

        val response = client.patch("/") {
            setBody("""{"name": "Rex"}""")
            contentType(ContentType.Application.Json)
        }

        assertEquals(HttpStatusCode.UnsupportedMediaType, response.status)
    }

    @Test
    fun `returns 200 and merges patch into current state`() = testApplication {
        install(ContentNegotiation) { json() }
        var receivedOld: Pet? = null
        var receivedNew: Pet? = null

        routing {
            mergePatch(
                stateProvider = { Pet("Buddy", 3) },
                afterPatch = { old, new ->
                    receivedOld = old
                    receivedNew = new
                    respondText("merged")
                },
            )
        }

        val response = client.patch("/") {
            setBody("""{"name": "Rex"}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals("merged", response.bodyAsText())
        assertEquals(Pet("Buddy", 3), receivedOld)
        assertEquals(Pet("Rex", 3), receivedNew)
    }

    @Test
    fun `null in patch clears field to null`() = testApplication {
        install(ContentNegotiation) { json() }
        var receivedNew: Pet? = null

        routing {
            mergePatch(
                stateProvider = { Pet("Buddy", 3, Address("Main St", "Berlin")) },
                afterPatch = { _, new ->
                    receivedNew = new
                    respondText("ok")
                },
            )
        }

        client.patch("/") {
            setBody("""{"name": null}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        assertEquals(Pet(null, 3, Address("Main St", "Berlin")), receivedNew)
    }

    @Test
    fun `empty patch returns current state unchanged`() = testApplication {
        install(ContentNegotiation) { json() }
        var receivedNew: Pet? = null

        routing {
            mergePatch(
                stateProvider = { Pet("Buddy", 3) },
                afterPatch = { _, new ->
                    receivedNew = new
                    respondText("ok")
                },
            )
        }

        client.patch("/") {
            setBody("""{}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        assertEquals(Pet("Buddy", 3), receivedNew)
    }

    @Test
    fun `partial patch leaves unmentioned fields unchanged`() = testApplication {
        install(ContentNegotiation) { json() }
        var receivedNew: Pet? = null

        routing {
            mergePatch(
                stateProvider = { Pet("Buddy", 3) },
                afterPatch = { _, new ->
                    receivedNew = new
                    respondText("ok")
                },
            )
        }

        client.patch("/") {
            setBody("""{"age": 5}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        assertEquals(Pet("Buddy", 5), receivedNew)
    }

    @Test
    fun `nested patch merges into existing nested object`() = testApplication {
        install(ContentNegotiation) { json() }
        var receivedNew: Pet? = null

        routing {
            mergePatch(
                stateProvider = { Pet("Buddy", 3, Address("Main St", "Berlin")) },
                afterPatch = { _, new ->
                    receivedNew = new
                    respondText("ok")
                },
            )
        }

        client.patch("/") {
            setBody("""{"address": {"city": "Munich"}}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        assertEquals(Pet("Buddy", 3, Address("Main St", "Munich")), receivedNew)
    }

    @Test
    fun `nested patch sets nested object when currently null`() = testApplication {
        install(ContentNegotiation) { json() }
        var receivedNew: Pet? = null

        routing {
            mergePatch(
                stateProvider = { Pet("Buddy", 3) },
                afterPatch = { _, new ->
                    receivedNew = new
                    respondText("ok")
                },
            )
        }

        client.patch("/") {
            setBody("""{"address": {"city": "Berlin"}}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        assertEquals(Pet("Buddy", 3, Address(city = "Berlin")), receivedNew)
    }

    @Test
    fun `malformed JSON returns 400`() = testApplication {
        install(ContentNegotiation) { json() }
        routing {
            mergePatch(
                stateProvider = { Pet("Buddy", 3) },
                afterPatch = { _, _ -> respondText("ok") },
            )
        }

        val response = client.patch("/") {
            setBody("not json at all")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun `non-object JSON returns 400`() = testApplication {
        install(ContentNegotiation) { json() }
        routing {
            mergePatch(
                stateProvider = { Pet("Buddy", 3) },
                afterPatch = { _, _ -> respondText("ok") },
            )
        }

        val response = client.patch("/") {
            setBody("\"just a string\"")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun `unknown field returns 400 by default`() = testApplication {
        install(ContentNegotiation) { json() }
        routing {
            mergePatch(
                stateProvider = { Pet("Buddy", 3) },
                afterPatch = { _, _ -> respondText("ok") },
            )
        }

        val response = client.patch("/") {
            setBody("""{"unknown": "x"}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun `wrong value type returns 400`() = testApplication {
        install(ContentNegotiation) { json() }
        routing {
            mergePatch(
                stateProvider = { Pet("Buddy", 3) },
                afterPatch = { _, _ -> respondText("ok") },
            )
        }

        val response = client.patch("/") {
            setBody("""{"age": "not-a-number"}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun `rejectUnknownFields false drops unknown keys`() = testApplication {
        install(ContentNegotiation) { json() }
        var receivedNew: Pet? = null

        routing {
            mergePatch(
                options = MergePatchOptions(rejectUnknownFields = false),
                stateProvider = { Pet("Buddy", 3) },
                afterPatch = { _, new ->
                    receivedNew = new
                    respondText("ok")
                },
            )
        }

        val response = client.patch("/") {
            setBody("""{"unknown": "x", "name": "Rex"}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals(Pet("Rex", 3), receivedNew)
    }

    @Test
    fun `list field is set via patch`() = testApplication {
        install(ContentNegotiation) { json() }
        var receivedNew: Pet? = null

        routing {
            mergePatch(
                stateProvider = { Pet("Buddy", 3, tags = listOf("a")) },
                afterPatch = { _, new ->
                    receivedNew = new
                    respondText("ok")
                },
            )
        }

        val response = client.patch("/") {
            setBody("""{"tags": ["x", "y"]}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals(listOf("x", "y"), receivedNew?.tags)
    }

    @Test
    fun `deeply nested array patch returns 400`() = testApplication {
        install(ContentNegotiation) { json() }
        routing {
            mergePatch(
                stateProvider = { Pet("Buddy", 3) },
                afterPatch = { _, _ -> respondText("ok") },
            )
        }

        val depth = 2000
        val response = client.patch("/") {
            setBody("""{"tags":${"[".repeat(depth)}${"]".repeat(depth)}}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }
}
