package xyz.lebkuchenfm.api

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.application.ApplicationCallPipeline
import io.ktor.server.application.Hook
import io.ktor.server.application.createRouteScopedPlugin
import io.ktor.server.routing.Route
import io.ktor.server.routing.RouteSelector
import io.ktor.server.routing.RouteSelectorEvaluation
import io.ktor.server.routing.RoutingResolveContext
import io.ktor.util.pipeline.PipelinePhase
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
 *
 * @see [ScopesEnforcementTest] for full coverage of enforcement behavior.
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

private class ScopesRouteSelector(private val scopes: Set<Scope>) : RouteSelector() {
    override suspend fun evaluate(context: RoutingResolveContext, segmentIndex: Int): RouteSelectorEvaluation {
        return RouteSelectorEvaluation.Transparent
    }

    override fun toString(): String = "(scopes: ${scopes.joinToString { it.value }})"
}

private object ScopesCheckHook : Hook<suspend (ApplicationCall) -> Unit> {
    private val ScopesCheckPhase = PipelinePhase("ScopesCheck")

    override fun install(pipeline: ApplicationCallPipeline, handler: suspend (ApplicationCall) -> Unit) {
        pipeline.insertPhaseAfter(ApplicationCallPipeline.Plugins, ScopesCheckPhase)
        pipeline.intercept(ScopesCheckPhase) {
            handler(context)
            if (context.response.isCommitted) {
                finish()
            }
        }
    }
}

private class ScopesCheckPluginConfig {
    var scopes: Set<Scope> = emptySet()
}

private val ScopesCheckPlugin = createRouteScopedPlugin("ScopesCheckPlugin", ::ScopesCheckPluginConfig) {
    val requiredScopes = pluginConfig.scopes

    on(ScopesCheckHook) { call ->
        val session = call.getUserSession()
        if (!session.scopes.containsAll(requiredScopes)) {
            val missing = requiredScopes - session.scopes
            call.respondWithProblem(
                title = "Insufficient permissions.",
                detail = "Missing required scopes: ${missing.joinToString { it.value }}.",
                status = HttpStatusCode.Forbidden,
            )
        }
    }
}
