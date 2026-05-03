package xyz.lebkuchenfm.api.plugins

import io.ktor.client.plugins.cookies.HttpCookies
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpStatusCode
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.response.respondText
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.ktor.server.sessions.Sessions
import io.ktor.server.sessions.cookie
import io.ktor.server.sessions.sessions
import io.ktor.server.sessions.set
import io.ktor.server.testing.testApplication
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.int
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import xyz.lebkuchenfm.domain.auth.Scope
import xyz.lebkuchenfm.domain.sessions.UserSession
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class ScopesCheckPluginTest {

    private fun pluginTestApp(
        grantedScopes: Set<Scope>,
        onHandlerExecuted: () -> Unit = {},
        testBlock: suspend (io.ktor.client.HttpClient) -> Unit,
    ) = testApplication {
        install(ContentNegotiation) { json() }
        install(Sessions) {
            cookie<UserSession>("user_session")
        }

        routing {
            get("/set-session") {
                call.sessions.set(UserSession("test-user", grantedScopes))
                call.respondText("ok")
            }

            route("/scoped-test") {
                install(ScopesCheckPlugin) { scopes = setOf(Scope.XSOUNDS_UPLOAD) }
                get {
                    onHandlerExecuted()
                    call.respondText("allowed")
                }
            }
        }

        val client = createClient { install(HttpCookies) }
        client.get("/set-session")
        testBlock(client)
    }

    @Test
    fun `returns 200 and executes handler when user has required scope`() {
        // given
        var handlerExecuted = false

        pluginTestApp(
            grantedScopes = setOf(Scope.XSOUNDS_UPLOAD),
            onHandlerExecuted = { handlerExecuted = true },
        ) { client ->
            // when
            val response = client.get("/scoped-test")

            // then
            assertEquals(HttpStatusCode.OK, response.status)
            assertEquals("allowed", response.bodyAsText())
            assertTrue(handlerExecuted)
        }
    }

    @Test
    fun `returns 403 and does not execute handler when user lacks required scope`() {
        // given
        var handlerExecuted = false

        pluginTestApp(
            grantedScopes = emptySet(),
            onHandlerExecuted = { handlerExecuted = true },
        ) { client ->
            // when
            val response = client.get("/scoped-test")

            // then
            assertEquals(HttpStatusCode.Forbidden, response.status)
            assertFalse(handlerExecuted)
        }
    }

    @Test
    fun `403 response contains problem details`() {
        pluginTestApp(grantedScopes = emptySet()) { client ->
            // when
            val response = client.get("/scoped-test")

            // then
            val json = Json.parseToJsonElement(response.bodyAsText()).jsonObject
            assertEquals("Insufficient permissions.", json["title"]?.jsonPrimitive?.content)
            assertEquals("Missing required scopes: xsounds:upload.", json["detail"]?.jsonPrimitive?.content)
            assertEquals(403, json["status"]?.jsonPrimitive?.int)
            assertEquals("/scoped-test", json["instance"]?.jsonPrimitive?.content)
        }
    }

    @Test
    fun `returns 403 when user has only some required scopes`() {
        pluginTestApp(grantedScopes = setOf(Scope.PLAYER_QUEUE)) { client ->
            // when
            val response = client.get("/scoped-test")

            // then
            assertEquals(HttpStatusCode.Forbidden, response.status)
        }
    }
}
