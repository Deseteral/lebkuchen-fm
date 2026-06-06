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
)

class MergePatchRouteTest {

    private val json = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
    }

    @Test
    fun `returns 415 when Content-Type is not merge-patch-json`() = testApplication {
        // given
        install(ContentNegotiation) { json() }
        routing {
            mergePatchRoute<Pet>(
                json = json,
                stateReader = { Pet("Buddy", 3) },
                onMerged = { _, _ -> respondText("ok") },
            )
        }

        // when
        val response = client.patch("/") {
            setBody("""{"name": "Rex"}""")
            contentType(ContentType.Application.Json)
        }

        // then
        assertEquals(HttpStatusCode.UnsupportedMediaType, response.status)
    }

    @Test
    fun `returns 200 and merges patch into current state`() = testApplication {
        // given
        var receivedOld: Pet? = null
        var receivedNew: Pet? = null

        routing {
            mergePatchRoute<Pet>(
                json = json,
                stateReader = { Pet("Buddy", 3) },
                onMerged = { old, new ->
                    receivedOld = old
                    receivedNew = new
                    respondText("merged")
                },
            )
        }

        // when
        val response = client.patch("/") {
            setBody("""{"name": "Rex"}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        // then
        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals("merged", response.bodyAsText())
        assertEquals(Pet("Buddy", 3), receivedOld)
        assertEquals(Pet("Rex", 3), receivedNew)
    }

    @Test
    fun `null in patch clears field to null`() = testApplication {
        // given
        var receivedNew: Pet? = null

        routing {
            mergePatchRoute<Pet>(
                json = json,
                stateReader = { Pet("Buddy", 3, Address("Main St", "Berlin")) },
                onMerged = { _, new ->
                    receivedNew = new
                    respondText("ok")
                },
            )
        }

        // when
        client.patch("/") {
            setBody("""{"name": null}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        // then
        assertEquals(Pet(null, 3, Address("Main St", "Berlin")), receivedNew)
    }

    @Test
    fun `empty patch returns current state unchanged`() = testApplication {
        // given
        var receivedNew: Pet? = null

        routing {
            mergePatchRoute<Pet>(
                json = json,
                stateReader = { Pet("Buddy", 3) },
                onMerged = { _, new ->
                    receivedNew = new
                    respondText("ok")
                },
            )
        }

        // when
        client.patch("/") {
            setBody("""{}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        // then
        assertEquals(Pet("Buddy", 3), receivedNew)
    }

    @Test
    fun `partial patch leaves unmentioned fields unchanged`() = testApplication {
        // given
        var receivedNew: Pet? = null

        routing {
            mergePatchRoute<Pet>(
                json = json,
                stateReader = { Pet("Buddy", 3) },
                onMerged = { _, new ->
                    receivedNew = new
                    respondText("ok")
                },
            )
        }

        // when
        client.patch("/") {
            setBody("""{"age": 5}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        // then
        assertEquals(Pet("Buddy", 5), receivedNew)
    }

    @Test
    fun `nested patch merges into existing nested object`() = testApplication {
        // given
        var receivedNew: Pet? = null

        routing {
            mergePatchRoute<Pet>(
                json = json,
                stateReader = { Pet("Buddy", 3, Address("Main St", "Berlin")) },
                onMerged = { _, new ->
                    receivedNew = new
                    respondText("ok")
                },
            )
        }

        // when
        client.patch("/") {
            setBody("""{"address": {"city": "Munich"}}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        // then
        assertEquals(Pet("Buddy", 3, Address("Main St", "Munich")), receivedNew)
    }

    @Test
    fun `nested patch sets nested object when currently null`() = testApplication {
        // given
        var receivedNew: Pet? = null

        routing {
            mergePatchRoute<Pet>(
                json = json,
                stateReader = { Pet("Buddy", 3) },
                onMerged = { _, new ->
                    receivedNew = new
                    respondText("ok")
                },
            )
        }

        // when
        client.patch("/") {
            setBody("""{"address": {"city": "Berlin"}}""")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        // then
        assertEquals(Pet("Buddy", 3, Address(city = "Berlin")), receivedNew)
    }

    @Test
    fun `malformed JSON returns 400`() = testApplication {
        // given
        install(ContentNegotiation) { json() }
        routing {
            mergePatchRoute<Pet>(
                json = json,
                stateReader = { Pet("Buddy", 3) },
                onMerged = { _, _ -> respondText("ok") },
            )
        }

        // when
        val response = client.patch("/") {
            setBody("not json at all")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        // then
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun `non-object JSON returns 400`() = testApplication {
        // given
        install(ContentNegotiation) { json() }
        routing {
            mergePatchRoute<Pet>(
                json = json,
                stateReader = { Pet("Buddy", 3) },
                onMerged = { _, _ -> respondText("ok") },
            )
        }

        // when
        val response = client.patch("/") {
            setBody("\"just a string\"")
            contentType(MERGE_PATCH_CONTENT_TYPE)
        }

        // then
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }
}
