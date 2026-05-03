package xyz.lebkuchenfm.domain.auth

import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.SerializationException
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder

private val logger = KotlinLogging.logger {}

/**
 * Represents a granular permission in the system.
 * Values follow the OAuth2 scope naming convention: "resource:action".
 */
@Serializable(with = ScopeSerializer::class)
enum class Scope(val value: String) {
    PLAYER_PLAYBACK_CONTROL("player:playback-control"),
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

object ScopeSerializer : KSerializer<Scope> {
    override val descriptor = PrimitiveSerialDescriptor("Scope", PrimitiveKind.STRING)

    override fun serialize(encoder: Encoder, value: Scope) = encoder.encodeString(value.value)

    override fun deserialize(decoder: Decoder): Scope {
        val raw = decoder.decodeString()
        return Scope.fromValue(raw) ?: run {
            logger.warn { "Unknown scope value '$raw', deserialization failed." }
            throw SerializationException("Unknown scope value: '$raw'")
        }
    }
}
