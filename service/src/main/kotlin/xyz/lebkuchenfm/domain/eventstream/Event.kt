package xyz.lebkuchenfm.domain.eventstream

import xyz.lebkuchenfm.domain.songs.Song
import java.util.UUID

typealias PlayerStateDonationRequestHandle = UUID

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
        val requestHandle: PlayerStateDonationRequestHandle,
    ) : Event
}
