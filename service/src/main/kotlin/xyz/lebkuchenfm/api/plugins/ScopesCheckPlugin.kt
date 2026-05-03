package xyz.lebkuchenfm.api.plugins

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.application.ApplicationCallPipeline
import io.ktor.server.application.Hook
import io.ktor.server.application.createRouteScopedPlugin
import io.ktor.server.routing.RouteSelector
import io.ktor.server.routing.RouteSelectorEvaluation
import io.ktor.server.routing.RoutingResolveContext
import io.ktor.util.pipeline.PipelinePhase
import xyz.lebkuchenfm.api.getUserSession
import xyz.lebkuchenfm.api.respondWithProblem
import xyz.lebkuchenfm.domain.auth.Scope

internal class ScopesRouteSelector(private val scopes: Set<Scope>) : RouteSelector() {
    override suspend fun evaluate(context: RoutingResolveContext, segmentIndex: Int): RouteSelectorEvaluation {
        return RouteSelectorEvaluation.Transparent
    }

    override fun toString(): String = "(scopes: ${scopes.joinToString()})"
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

class ScopesCheckPluginConfig {
    var scopes: Set<Scope> = emptySet()
}

val ScopesCheckPlugin = createRouteScopedPlugin("ScopesCheckPlugin", ::ScopesCheckPluginConfig) {
    val requiredScopes = pluginConfig.scopes

    on(ScopesCheckHook) { call ->
        val session = call.getUserSession()
        if (!session.scopes.containsAll(requiredScopes)) {
            val missing = requiredScopes - session.scopes
            call.respondWithProblem(
                title = "Insufficient permissions.",
                detail = "Missing required scopes: ${missing.joinToString()}.",
                status = HttpStatusCode.Forbidden,
            )
        }
    }
}
