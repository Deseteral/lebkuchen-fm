package xyz.lebkuchenfm.domain.eventstream

import xyz.lebkuchenfm.domain.songs.Song

sealed interface Event {
    val id: String
}

data class PlayXSoundEvent(
    override val id: String = "PlayXSoundEvent",
    val soundUrl: String,
) : Event

data class QueueSongsEvent(
    override val id: String = "AddSongsToQueueEvent",
    // TODO: consider separate type for event stream
    val songs: List<Song>,
) : Event
