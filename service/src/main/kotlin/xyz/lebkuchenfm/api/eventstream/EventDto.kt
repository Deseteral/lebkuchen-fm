package xyz.lebkuchenfm.api.eventstream

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.DefaultStateProvider
import xyz.lebkuchenfm.domain.eventstream.Event

@Serializable
sealed interface EventDto

fun Event.mapToDto(): EventDto = when (this) {
    is Event.PlayXSound -> PlayXSoundEventDto(this)
    is Event.QueueSongs -> AddSongsToQueueEventDto(this)
    is Event.PlayerStateRequest -> PlayerStateRequestEventDto(this)
    is Event.PlayerStateUpdate<*> -> PlayerStateUpdateEventDto(this)
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
@SerialName("PlayerStateRequestEvent")
data class PlayerStateRequestEventDto(
    val requestId: String,
) : EventDto {
    constructor(event: Event.PlayerStateRequest) : this(event.requestId.toString())
}

@Serializable
data class PlayerStateDto(
    val currentlyPlaying: CurrentlyPlayingDto?,
    val queue: List<SongDto>,
    val isPlaying: Boolean,
    val volume: Int,
) {
    @Serializable
    data class CurrentlyPlayingDto(
        val song: SongDto,
        val time: Int,
    )

    @Serializable
    data class SongDto(
        val name: String,
        val youtubeId: String,
    )
}

@Serializable
@SerialName("PlayerStateUpdateEvent")
data class PlayerStateUpdateEventDto(
    val state: PlayerStateDto,
) : EventDto {
    constructor(event: Event.PlayerStateUpdate<*>) : this(
        if (event.state is PlayerStateDto) event.state else throw IllegalArgumentException(),
    )
}

@Serializable
@SerialName("PlayerStateDonationEvent")
data class PlayerStateDonationEventDto(
    val requestId: String,
    val state: PlayerStateDto,
) : EventDto

object DefaultPlayerStateDtoProvider : DefaultStateProvider<PlayerStateDto> {
    override fun getDefaultState() =
        PlayerStateDto(currentlyPlaying = null, queue = emptyList(), isPlaying = false, volume = 100)
}
