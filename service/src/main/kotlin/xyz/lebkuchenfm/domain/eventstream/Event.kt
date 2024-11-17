package xyz.lebkuchenfm.domain.eventstream

import xyz.lebkuchenfm.domain.RequestHandle
import xyz.lebkuchenfm.domain.songs.Song

sealed interface Event {
    data class PlayXSound(
        val soundUrl: String,
    ) : Event

    data class QueueSongs(
        val songs: List<Song>,
    ) : Event

    data class PlayerStateUpdate<T>(
        val state: T,
    ) : Event

    data class PlayerStateRequestDonation(
        val requestHandle: RequestHandle,
    ) : Event
}
