package xyz.lebkuchenfm.domain.auth

import kotlinx.serialization.Serializable

/**
 * Represents a granular permission in the system.
 * Values follow the OAuth2 scope naming convention: "resource:action".
 */
@Serializable
enum class Scope(val value: String) {
    PLAYER_PLAYBACK_CONTROL("player:control"),
    PLAYER_QUEUE("player:queue"),
    PLAYER_SKIP("player:skip"),
    XSOUNDS_PLAY("xsounds:play"),
    XSOUNDS_UPLOAD("xsounds:upload"),
    XSOUNDS_MANAGE("xsounds:manage"),
    USERS_MANAGE("users:manage"),
    ;

    companion object {
        private val map = entries.associateBy { it.value }

        fun fromValue(value: String): Scope? = map[value]
    }
}
