package xyz.lebkuchenfm.domain.eventstream

import xyz.lebkuchenfm.domain.songs.Song

sealed interface Event

data class PlayXSoundEvent(
    val soundUrl: String,
) : Event

data class QueueSongsEvent(
    val songs: List<Song>,
) : Event
