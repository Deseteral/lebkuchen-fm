package xyz.lebkuchenfm.domain.eventstream

import xyz.lebkuchenfm.domain.songs.Song

sealed interface Event

data class PlayXSoundEvent(
    val soundUrl: String,
) : Event

data class AddSongsToQueueEvent(
    // TODO: should that be api DTO Song, domain Song, or separate event stream Song?
    val songs: List<Song>,
) : Event
