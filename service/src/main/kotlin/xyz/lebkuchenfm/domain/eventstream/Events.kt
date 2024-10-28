package xyz.lebkuchenfm.domain.eventstream

sealed interface Event

data class PlayXSoundEvent(
    val soundUrl: String,
) : Event
