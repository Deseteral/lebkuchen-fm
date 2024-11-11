package xyz.lebkuchenfm.api.eventstream

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.eventstream.Event
import kotlin.random.Random

@Serializable
sealed interface EventDto

fun Event.mapToDto(): EventDto = when (this) {
    is Event.PlayXSound -> PlayXSoundEventDto(this)
    is Event.QueueSongs -> AddSongsToQueueEventDto(this)
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
data object PlayerStateRequestEventDto : EventDto

// TODO: Default data is just for testing. Remove later.
@Serializable
@SerialName("PlayerStateUpdateEvent")
data class PlayerStateUpdateEventDto(
    val state: PlayerState = PlayerState(),
) : EventDto {
    @Serializable
    data class PlayerState(
        val currentlyPlaying: CurrentlyPlaying? = CurrentlyPlaying(
            song = SongDto(
                "Baba na rowerze",
                "78ruW28aHsM",
            ),
            time = Random.nextInt(20, 120),
        ),
        val queue: List<SongDto> = emptyList(),
        val isPlaying: Boolean = true,
        val volume: Int = 100,
    ) {
        @Serializable
        data class CurrentlyPlaying(
            val song: SongDto,
            val time: Int,
        )

        @Serializable
        data class SongDto(
            val name: String,
            val youtubeId: String,
        )
    }
}
