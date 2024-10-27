package xyz.lebkuchenfm.domain.eventstream

interface Event

data class PlayXSoundEvent(
    val soundUrl: String,
): Event
