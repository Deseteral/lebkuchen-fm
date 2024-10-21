package xyz.lebkuchenfm

import io.ktor.client.request.get
import io.ktor.server.testing.testApplication
import kotlin.test.Test

class ApplicationTest {
    @Test
    fun testRoot() =
        testApplication {
            client.get("/").apply {
                // TODO: Tests to be done later.
                // assertEquals(HttpStatusCode.OK, status)
                // assertEquals("Hello World!", bodyAsText())
            }
        }
}
