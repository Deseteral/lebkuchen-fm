package xyz.lebkuchenfm.domain.eventstream

sealed interface Event {
    data class PlayXSound(
        val soundUrl: String,
    ) : Event
}
