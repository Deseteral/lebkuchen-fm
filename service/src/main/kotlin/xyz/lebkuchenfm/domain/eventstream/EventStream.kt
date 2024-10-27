package xyz.lebkuchenfm.domain.eventstream

interface EventStream {
    fun sendToEveryone(event: Event)
}
