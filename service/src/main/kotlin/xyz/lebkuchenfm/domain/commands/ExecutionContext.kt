package xyz.lebkuchenfm.domain.commands

import xyz.lebkuchenfm.domain.auth.Scope
import xyz.lebkuchenfm.domain.auth.UserSession

data class ExecutionContext(val session: UserSession) {
    val scopes: Set<Scope> get() = session.scopes.mapNotNull { Scope.fromValue(it) }.toSet()
}
