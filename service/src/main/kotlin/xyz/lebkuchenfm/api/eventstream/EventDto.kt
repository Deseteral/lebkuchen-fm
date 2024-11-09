package xyz.lebkuchenfm.api.eventstream

import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.eventstream.Event

@Serializable
sealed interface EventDto {
    val id: String
}

fun Event.mapToDto(): EventDto = when (this) {
    is Event.PlayXSound -> PlayXSoundEventDto(this)
    is Event.QueueSongs -> QueueSongsEventDto(this)
}

@Serializable
data class PlayXSoundEventDto(
    val soundUrl: String,
) : EventDto {
    override val id = "PlayXSound"

    constructor(event: Event.PlayXSound) : this(
        soundUrl = event.soundUrl,
    )
}

@Serializable
data class QueueSongsEventDto(
    val songs: List<SongDto>,
) : EventDto {
    override val id = "QueueSongs"

    constructor(event: Event.QueueSongs) : this(
        songs = event.songs.map { SongDto(it.name, it.youtubeId) },
    )

    @Serializable
    data class SongDto(
        val name: String,
        val youtubeId: String,
    )
}
