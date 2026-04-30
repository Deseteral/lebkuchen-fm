package xyz.lebkuchenfm.domain.sessions

import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.auth.Scope

@Serializable
data class UserSession(
    val name: String,
    val scopes: Set<Scope> = emptySet(),
)
