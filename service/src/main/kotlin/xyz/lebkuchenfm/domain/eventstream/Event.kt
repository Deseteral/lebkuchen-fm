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
        val all: Boolean,
        val amount: Int,
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
