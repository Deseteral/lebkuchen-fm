package xyz.lebkuchenfm.domain.eventstream

import io.ktor.util.collections.ConcurrentMap
import java.util.UUID

abstract class EventStream<ConsumerT : EventStream.Consumer> {
    protected val subscriptions: MutableMap<EventStreamConsumerId, ConsumerT> = ConcurrentMap()

    abstract suspend fun sendToOne(id: EventStreamConsumerId, event: Event)

    abstract fun shouldSend(consumer: ConsumerT, event: Event): Boolean

    suspend fun sendToEveryone(event: Event, exclude: EventStreamConsumerId? = null): Int {
        var sentCount = 0
        for ((id, consumer) in subscriptions) {
            if (id == exclude) continue
            if (!shouldSend(consumer, event)) continue
            sendToOne(id, event)
            sentCount += 1
        }
        return sentCount
    }

    open fun subscribe(consumer: ConsumerT) {
        subscriptions[consumer.id] = consumer
    }

    open fun unsubscribe(consumer: ConsumerT) {
        subscriptions.remove(consumer.id)
    }

    val subscriptionCount get() = subscriptions.count()

    interface Consumer {
        val id: EventStreamConsumerId
    }
}

typealias EventStreamConsumerId = UUID
