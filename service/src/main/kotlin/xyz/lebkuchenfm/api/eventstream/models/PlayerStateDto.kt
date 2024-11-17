package xyz.lebkuchenfm.api.eventstream.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.PlayerStateSynchronizer
import xyz.lebkuchenfm.domain.eventstream.Event

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
        val time: Double,
    )

    @Serializable
    data class SongDto(
        val name: String,
        val youtubeId: String,
    )
}

object DefaultPlayerStateDtoProvider : PlayerStateSynchronizer.DefaultStateProvider<PlayerStateDto> {
    override fun getDefaultState() =
        PlayerStateDto(currentlyPlaying = null, queue = emptyList(), isPlaying = false, volume = 100)
}

@Serializable
@SerialName("PlayerStateRequestEvent")
data object PlayerStateRequestEventDto : EventDto

@Serializable
@SerialName("PlayerStateUpdateEvent")
data class PlayerStateUpdateEventDto(
    val state: PlayerStateDto,
) : EventDto {
    constructor(event: Event.PlayerStateUpdate<*>) : this(
        // TODO: Exception message.
        if (event.state is PlayerStateDto) event.state else throw IllegalArgumentException(),
    )
}

@Serializable
@SerialName("PlayerStateRequestDonationEvent")
data class PlayerStateRequestDonationEventDto(
    val requestHandle: String,
) : EventDto {
    constructor(event: Event.PlayerStateRequestDonation) : this(event.requestHandle.toString())
}

@Serializable
@SerialName("PlayerStateDonationEvent")
data class PlayerStateDonationEventDto(
    val requestHandle: String,
    val state: PlayerStateDto,
) : EventDto
