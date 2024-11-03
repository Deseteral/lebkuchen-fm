package xyz.lebkuchenfm.api.auth

import kotlinx.serialization.Serializable

@Serializable
data class UserSession(val name: String)
