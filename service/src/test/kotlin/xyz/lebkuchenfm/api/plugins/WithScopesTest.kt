package xyz.lebkuchenfm.api.plugins

import io.ktor.server.application.findPluginInRoute
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.RoutingNode
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import io.ktor.server.testing.testApplication
import xyz.lebkuchenfm.domain.auth.Scope
import kotlin.test.Test
import kotlin.test.assertNotNull

class WithScopesTest {

    @Test
    fun `withScopes installs ScopesCheckPlugin on route`() = testApplication {
        // given
        lateinit var scopedRoute: Route

        // when
        application {
            routing {
                scopedRoute = withScopes(Scope.XSOUNDS_UPLOAD) {
                    get("/test") { call.respondText("ok") }
                }
            }
        }
        startApplication()

        // then
        val plugin = (scopedRoute as RoutingNode).findPluginInRoute(ScopesCheckPlugin)
        assertNotNull(plugin)
    }
}
