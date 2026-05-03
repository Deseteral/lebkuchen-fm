package xyz.lebkuchenfm.domain.auth

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.serializer

/**
 * Represents a granular permission in the system.
 * Values follow the OAuth2 scope naming convention: "resource:action".
 */
@Serializable
enum class Scope {
    @SerialName("player:playback-control")
    PLAYER_PLAYBACK_CONTROL,

    @SerialName("player:queue")
    PLAYER_QUEUE,

    @SerialName("player:skip")
    PLAYER_SKIP,

    @SerialName("xsounds:play")
    XSOUNDS_PLAY,

    @SerialName("xsounds:upload")
    XSOUNDS_UPLOAD,

    @SerialName("xsounds:manage")
    XSOUNDS_MANAGE,

    @SerialName("users:manage")
    USERS_MANAGE,

    @SerialName("integrations:manage")
    INTEGRATIONS_MANAGE,
    ;

    override fun toString(): String = serializer().descriptor.getElementName(ordinal)
}
