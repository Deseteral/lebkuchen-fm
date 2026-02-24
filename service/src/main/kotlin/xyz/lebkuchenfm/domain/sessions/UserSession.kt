package xyz.lebkuchenfm.domain.sessions

import kotlinx.serialization.Serializable

@Serializable
data class UserSession(
    val name: String,
)
