package xyz.lebkuchenfm.api.eventstream.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.Event.Skip.Amount

@Serializable
sealed interface EventDto

fun Event.mapToDto(): EventDto = when (this) {
    is Event.PlayXSound -> PlayXSoundEventDto(this)
    is Event.QueueSongs -> AddSongsToQueueEventDto(this)
    is Event.PlayerStateUpdate<*> -> PlayerStateUpdateEventDto(this)
    is Event.PlayerStateRequestDonation -> PlayerStateRequestDonationEventDto(this)
    is Event.Skip -> SkipEventDto(this)
    is Event.Resume -> PlayerResumeEventDto(this)
    is Event.Pause -> PlayerPauseEventDto(this)
}

@Serializable
@SerialName("PlayXSoundEvent")
data class PlayXSoundEventDto(
    val soundUrl: String,
    val soundName: String? = null,
    val actorName: String? = null,
) : EventDto {
    constructor(event: Event.PlayXSound) : this(
        soundUrl = event.soundUrl,
        soundName = event.soundName,
        actorName = event.actorName,
    )
}

@Serializable
@SerialName("AddSongsToQueueEvent")
data class AddSongsToQueueEventDto(
    val songs: List<SongDto>,
    val actorName: String? = null,
) : EventDto {
    constructor(event: Event.QueueSongs) : this(
        songs = event.songs.map { SongDto(it.name, it.youtubeId.value) },
        actorName = event.actorName,
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
    val actorName: String? = null,
) : EventDto {
    constructor(event: Event.Skip) : this(
        skipAll = event.amount is Amount.All,
        amount = (event.amount as? Amount.Some)?.amount ?: 1,
        actorName = event.actorName,
    )
}

@Serializable
@SerialName("ResumeEvent")
data class PlayerResumeEventDto(
    val actorName: String? = null,
) : EventDto {
    constructor(event: Event.Resume) : this(actorName = event.actorName)
}

@Serializable
@SerialName("PauseEvent")
data class PlayerPauseEventDto(
    val actorName: String? = null,
) : EventDto {
    constructor(event: Event.Pause) : this(actorName = event.actorName)
}

@Serializable
@SerialName("SongChanged")
data class SongChangedEventDto(
    val song: SongDto,
) : EventDto {
    @Serializable
    data class SongDto(
        val name: String,
        val youtubeId: String,
    )
}
