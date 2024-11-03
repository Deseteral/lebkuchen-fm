package xyz.lebkuchenfm.domain.auth

import kotlinx.serialization.Serializable

// TODO: I'm not sure if this is the right name for that class.
@Serializable
data class UserSession(val name: String)
