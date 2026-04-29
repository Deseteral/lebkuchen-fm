package xyz.lebkuchenfm.api.plugins

import io.ktor.server.routing.Route
import xyz.lebkuchenfm.domain.auth.Scope

/**
 * Creates a route scope that requires the authenticated user to have all [requiredScopes].
 * If the user's session does not contain the required scopes, responds with 403 Forbidden
 * and halts the pipeline (the route handler never executes).
 *
 * Usage:
 * ```
 * withScopes(Scope.XSOUNDS_UPLOAD) {
 *     post { call.respond(HttpStatusCode.OK) }
 * }
 * ```
 */
fun Route.withScopes(vararg requiredScopes: Scope, build: Route.() -> Unit): Route {
    val required = requiredScopes.toSet()
    val route = createChild(ScopesRouteSelector(required))

    route.install(ScopesCheckPlugin) {
        scopes = required
    }

    route.build()
    return route
}
