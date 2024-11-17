package xyz.lebkuchenfm.domain.eventstream

import io.ktor.util.collections.ConcurrentMap
import java.util.UUID

typealias EventStreamClientId = UUID

interface EventStreamClient {
    val id: EventStreamClientId
}

abstract class EventStream<T: EventStreamClient> {
    protected val clients: MutableMap<EventStreamClientId, T> = ConcurrentMap()

    abstract suspend fun sendToOne(id: EventStreamClientId, event: Event)

    suspend fun sendToEveryone(event: Event, exclude: EventStreamClientId? = null) {
        for (id in clients.keys) {
            if (id == exclude) continue
            sendToOne(id, event)
        }
    }

    open fun addConnection(client: T) {
        clients[client.id] = client
    }

    open fun removeConnection(client: T) {
        clients.remove(client.id)
    }

    val connectedClientsCount get() = clients.count()
}
