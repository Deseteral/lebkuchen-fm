package xyz.lebkuchenfm.domain.eventstream

import xyz.lebkuchenfm.domain.radiopersonality.tts.Base64EncodedAudio
import xyz.lebkuchenfm.domain.songs.Song
import java.util.UUID

sealed interface Event {
    data class PlayXSound(
        val soundUrl: String,
    ) : Event

    data class QueueSongs(
        val songs: List<Song>,
    ) : Event

    data class Skip(
        val amount: Amount,
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

    data object Resume : Event

    data object Pause : Event

    data class PlayerStateUpdate<T>(
        val state: T,
    ) : Event

    data class PlayerStateRequestDonation(
        val requestHandle: RequestHandle,
    ) : Event {
        @JvmInline
        value class RequestHandle(val value: String = UUID.randomUUID().toString())
    }

    data class Say(
        val text: String,
        val audio: Base64EncodedAudio,
    ) : Event
}
