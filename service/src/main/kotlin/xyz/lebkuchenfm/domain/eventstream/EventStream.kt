package xyz.lebkuchenfm.domain.eventstream

interface EventStream {
    suspend fun sendToEveryone(event: Event)
}
