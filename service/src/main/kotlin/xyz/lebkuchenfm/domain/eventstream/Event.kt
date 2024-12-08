package xyz.lebkuchenfm.domain.eventstream

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
        val amount: SkipAmount,
    ) : Event

    data object Resume : Event

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

sealed class SkipAmount {
    data object All : SkipAmount()
    data class Some(val amount: Int) : SkipAmount()

    companion object {
        fun fromString(value: String?): SkipAmount? = when (value) {
            "all" -> All
            null, "1" -> Some(1)
            else -> value.toIntOrNull()
                ?.takeIf { it > 1 }
                ?.let { Some(it) }
        }
    }
}
