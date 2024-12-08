package xyz.lebkuchenfm.domain.auth

import kotlinx.serialization.Serializable

@Serializable
data class UserSession(
    val name: String,
    val apiToken: String,
)
