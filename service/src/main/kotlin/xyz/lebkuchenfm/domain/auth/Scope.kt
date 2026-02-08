package xyz.lebkuchenfm.domain.auth

import kotlinx.serialization.Serializable

@Serializable
enum class Scope(val value: String) {
    USERS_ADD("users:add"),
    USERS_DELETE("users:delete"),
    USERS_LIST("users:list"),
    USERS_MANAGE_ROLES("users:roles"),
    PLAYER_QUEUE("player:queue"),
    PLAYER_CONTROL("player:control"),
    XSOUNDS_PLAY("xsounds:play"),
    XSOUNDS_UPLOAD("xsounds:upload"),
    XSOUNDS_MANAGE_TAGS("xsounds:tags"),
    COMMANDS_EXECUTE("commands:execute"),
    ;

    companion object {
        fun fromValue(value: String): Scope? = entries.find { it.value == value }

        val ALL: Set<Scope> = entries.toSet()
    }
}
