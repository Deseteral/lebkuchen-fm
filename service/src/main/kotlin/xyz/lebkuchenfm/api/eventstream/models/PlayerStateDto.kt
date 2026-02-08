package xyz.lebkuchenfm.api.eventstream.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.PlayerStateSynchronizer

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
        PlayerStateDto(currentlyPlaying = null, queue = emptyList(), isPlaying = true, volume = 100)
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
        if (event.state is PlayerStateDto) {
            event.state
        } else {
            throw IllegalArgumentException("This event DTO can only be created with player state DTO.")
        },
    )
}

@Serializable
@SerialName("PlayerStateRequestDonationEvent")
data class PlayerStateRequestDonationEventDto(
    val requestHandle: String,
) : EventDto {
    constructor(event: Event.PlayerStateRequestDonation) : this(event.requestHandle.value)
}

@Serializable
@SerialName("PlayerStateDonationEvent")
data class PlayerStateDonationEventDto(
    val requestHandle: String,
    val state: PlayerStateDto?,
) : EventDto
