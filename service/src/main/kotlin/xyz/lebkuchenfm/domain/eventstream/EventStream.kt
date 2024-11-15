package xyz.lebkuchenfm.domain.eventstream

import io.ktor.util.collections.ConcurrentMap
import java.util.UUID

typealias EventStreamClientId = UUID

abstract class EventStream<T> {
    protected val clients: MutableMap<EventStreamClientId, T> = ConcurrentMap()

    abstract suspend fun sendToOne(id: EventStreamClientId, event: Event)

    suspend fun sendToEveryone(event: Event, exclude: EventStreamClientId? = null) {
        clients.keys.forEach { id ->
            if (id == exclude) return
            sendToOne(id, event)
        }
    }

    val connectedClientsCount = clients.count()
}
