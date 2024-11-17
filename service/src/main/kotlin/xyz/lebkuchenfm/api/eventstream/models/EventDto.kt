package xyz.lebkuchenfm.api.eventstream.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.eventstream.Event

@Serializable
sealed interface EventDto

fun Event.mapToDto(): EventDto = when (this) {
    is Event.PlayXSound -> PlayXSoundEventDto(this)
    is Event.QueueSongs -> AddSongsToQueueEventDto(this)
    is Event.PlayerStateUpdate<*> -> PlayerStateUpdateEventDto(this)
    is Event.PlayerStateRequestDonation -> PlayerStateRequestDonationEventDto(this)
}

@Serializable
@SerialName("PlayXSoundEvent")
data class PlayXSoundEventDto(
    val soundUrl: String,
) : EventDto {
    constructor(event: Event.PlayXSound) : this(
        soundUrl = event.soundUrl,
    )
}

@Serializable
@SerialName("AddSongsToQueueEvent")
data class AddSongsToQueueEventDto(
    val songs: List<SongDto>,
) : EventDto {
    constructor(event: Event.QueueSongs) : this(
        songs = event.songs.map { SongDto(it.name, it.youtubeId) },
    )

    @Serializable
    data class SongDto(
        val name: String,
        val youtubeId: String,
    )
}
