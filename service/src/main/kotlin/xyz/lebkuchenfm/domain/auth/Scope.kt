package xyz.lebkuchenfm.domain.auth

/**
 * Represents a granular permission in the system.
 * Values follow the OAuth2 scope naming convention: "resource:action".
 */
enum class Scope(val value: String) {
    PLAYER_CONTROL("player:control"),
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
