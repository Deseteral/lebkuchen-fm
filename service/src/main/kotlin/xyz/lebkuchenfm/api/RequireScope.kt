package xyz.lebkuchenfm.api

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.routing.get
import xyz.lebkuchenfm.domain.auth.Scope

suspend fun ApplicationCall.missesScopes(vararg scopes: Scope): Boolean {
    val session = getUserSession()
    val scopesSet = scopes.toSet()
    val userScopes = session.scopes.mapNotNull { Scope.fromValue(it) }.toSet()
    val missingScopes = scopesSet - userScopes

    return if (missingScopes.isEmpty()) {
        false
    } else {
        val missingScopesText = missingScopes.joinToString(", ") { "'${it.value}'" }
        respondWithProblem(
            title = "Access Denied",
            detail = if (scopes.count() > 1) {
                "Required scopes $missingScopesText are missing."
            } else {
                "Required scope $missingScopesText is missing."
            },
            status = HttpStatusCode.Forbidden,
        )
        true // short-circuit
    }
}
