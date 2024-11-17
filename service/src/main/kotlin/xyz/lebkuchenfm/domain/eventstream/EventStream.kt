package xyz.lebkuchenfm.domain.eventstream

import io.ktor.util.collections.ConcurrentMap
import java.util.UUID

abstract class EventStream<ConsumerT : EventStreamConsumer> {
    protected val subscriptions: MutableMap<EventStreamConsumerId, ConsumerT> = ConcurrentMap()

    abstract suspend fun sendToOne(id: EventStreamConsumerId, event: Event)

    suspend fun sendToEveryone(event: Event, exclude: EventStreamConsumerId? = null) {
        for (id in subscriptions.keys) {
            if (id == exclude) continue
            sendToOne(id, event)
        }
    }

    open fun subscribe(consumer: ConsumerT) {
        subscriptions[consumer.id] = consumer
    }

    open fun unsubscribe(consumer: ConsumerT) {
        subscriptions.remove(consumer.id)
    }

    val subscriptionCount get() = subscriptions.count()
}

typealias EventStreamConsumerId = UUID

interface EventStreamConsumer {
    val id: EventStreamConsumerId
}
