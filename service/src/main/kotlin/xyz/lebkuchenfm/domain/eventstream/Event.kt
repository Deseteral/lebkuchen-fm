package xyz.lebkuchenfm.domain.eventstream

import xyz.lebkuchenfm.domain.auth.Scope
import xyz.lebkuchenfm.domain.songs.Song
import java.util.UUID

sealed interface Event {
    val requiredScope: Scope? get() = null

    data class PlayXSound(
        val soundUrl: String,
        val soundName: String? = null,
        val actorName: String? = null,
    ) : Event {
        override val requiredScope: Scope = Scope.XSOUNDS_LISTEN
    }

    data class QueueSongs(
        val songs: List<Song>,
        val actorName: String? = null,
    ) : Event

    data class Skip(
        val amount: Amount,
        val actorName: String? = null,
    ) : Event {
        sealed class Amount {
            data object All : Amount()
            data class Some(val amount: Int) : Amount()

            companion object {
                fun fromString(value: String?): Amount? = when (value) {
                    "all" -> All
                    null, "1" -> Some(1)
                    else -> value.toIntOrNull()
                        ?.takeIf { it > 1 }
                        ?.let { Some(it) }
                }
            }
        }
    }

    data class Resume(
        val actorName: String? = null,
    ) : Event

    data class Pause(
        val actorName: String? = null,
    ) : Event

    data class PlayerStateUpdate<T>(
        val state: T,
    ) : Event

    data class PlayerStateRequestDonation(
        val requestHandle: RequestHandle,
    ) : Event {
        @JvmInline
        value class RequestHandle(val value: String = UUID.randomUUID().toString())
    }
}
