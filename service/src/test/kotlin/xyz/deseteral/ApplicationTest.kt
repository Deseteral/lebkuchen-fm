package xyz.deseteral

import io.ktor.client.request.get
import io.ktor.server.testing.testApplication
import kotlin.test.Test
import xyz.deseteral.plugins.configureRouting

class ApplicationTest {
    @Test
    fun testRoot() = testApplication {
        application { configureRouting() }
        client.get("/").apply {
            // TODO: Tests to be done later.
            // assertEquals(HttpStatusCode.OK, status)
            // assertEquals("Hello World!", bodyAsText())
        }
    }
}
