package xyz.lebkuchenfm.domain.eventstream

sealed interface Event

data class PlayXSoundEvent(
    val soundUrl: String,
) : Event

data class QueueSongsEvent(
    val youtubeIds: List<String>,
) : Event
