package xyz.lebkuchenfm.api.eventstream.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.SkipAmount

@Serializable
sealed interface EventDto

fun Event.mapToDto(): EventDto = when (this) {
    is Event.PlayXSound -> PlayXSoundEventDto(this)
    is Event.QueueSongs -> AddSongsToQueueEventDto(this)
    is Event.PlayerStateUpdate<*> -> PlayerStateUpdateEventDto(this)
    is Event.PlayerStateRequestDonation -> PlayerStateRequestDonationEventDto(this)
    is Event.Skip -> SkipEventDto(this)
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

@Serializable
@SerialName("SkipEvent")
data class SkipEventDto(
    val skipAll: Boolean,
    val amount: Int,
) : EventDto {
    constructor(event: Event.Skip) : this(
        skipAll = event.amount is SkipAmount.All,
        amount = (event.amount as? SkipAmount.Some)?.amount ?: 1,
    )
}
