package xyz.lebkuchenfm.api

import io.ktor.client.plugins.cookies.HttpCookies
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpStatusCode
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.install
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
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

class ScopesEnforcementTest {

    private fun scopesTestApp(grantedScopes: Set<Scope>, testBlock: suspend (io.ktor.client.HttpClient) -> Unit) =
        testApplication {
            install(ContentNegotiation) { json() }
            install(Sessions) {
                cookie<UserSession>("user_session")
            }

            var handlerExecuted = false

            routing {
                get("/set-session") {
                    call.sessions.set(UserSession("test-user", grantedScopes))
                    call.respondText("ok")
                }

                withScopes(Scope.XSOUNDS_UPLOAD) {
                    get("/with-scopes-test") {
                        handlerExecuted = true
                        call.respondText("allowed")
                    }
                }

                get("/handler-executed") {
                    call.respond(handlerExecuted.toString())
                }
            }

            val client = createClient { install(HttpCookies) }
            client.get("/set-session")
            testBlock(client)
        }

    // -- withScopes tests --

    @Test
    fun `withScopes returns 200 when user has required scope`() {
        scopesTestApp(grantedScopes = setOf(Scope.XSOUNDS_UPLOAD)) { client ->
            val response = client.get("/with-scopes-test")
            assertEquals(HttpStatusCode.OK, response.status)
            assertEquals("allowed", response.bodyAsText())
        }
    }

    @Test
    fun `withScopes returns 403 when user lacks required scope`() {
        scopesTestApp(grantedScopes = emptySet()) { client ->
            val response = client.get("/with-scopes-test")
            assertEquals(HttpStatusCode.Forbidden, response.status)
        }
    }

    @Test
    fun `withScopes handler executes on 200`() {
        scopesTestApp(grantedScopes = setOf(Scope.XSOUNDS_UPLOAD)) { client ->
            client.get("/with-scopes-test")
            val flagResponse = client.get("/handler-executed")
            assertTrue(flagResponse.bodyAsText().toBoolean())
        }
    }

    @Test
    fun `withScopes handler does not execute on 403`() {
        scopesTestApp(grantedScopes = emptySet()) { client ->
            client.get("/with-scopes-test")
            val flagResponse = client.get("/handler-executed")
            assertFalse(flagResponse.bodyAsText().toBoolean())
        }
    }

    @Test
    fun `withScopes 403 response contains problem details`() {
        scopesTestApp(grantedScopes = emptySet()) { client ->
            val response = client.get("/with-scopes-test")
            val json = Json.parseToJsonElement(response.bodyAsText()).jsonObject

            assertEquals("Insufficient permissions.", json["title"]?.jsonPrimitive?.content)
            assertEquals("Missing required scopes: xsounds:upload.", json["detail"]?.jsonPrimitive?.content)
            assertEquals(403, json["status"]?.jsonPrimitive?.int)
            assertEquals("/with-scopes-test", json["instance"]?.jsonPrimitive?.content)
        }
    }

    @Test
    fun `withScopes returns 403 when user has only some required scopes`() {
        scopesTestApp(grantedScopes = setOf(Scope.PLAYER_QUEUE)) { client ->
            val response = client.get("/with-scopes-test")
            assertEquals(HttpStatusCode.Forbidden, response.status)
        }
    }
}
