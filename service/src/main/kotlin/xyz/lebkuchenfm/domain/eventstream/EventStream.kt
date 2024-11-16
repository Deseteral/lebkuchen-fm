package xyz.lebkuchenfm.domain.eventstream

import io.ktor.util.collections.ConcurrentMap
import java.util.UUID

typealias EventStreamClientId = UUID

abstract class EventStream<T> {
    protected val clients: MutableMap<EventStreamClientId, T> = ConcurrentMap()

    abstract suspend fun sendToOne(id: EventStreamClientId, event: Event)

    suspend fun sendToEveryone(event: Event, exclude: EventStreamClientId? = null) {
        for (id in clients.keys) {
            if (id == exclude) continue
            sendToOne(id, event)
        }
    }

    val connectedClientsCount get() = clients.count()
}
