package xyz.lebkuchenfm.api.eventstream

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.serialization.serialize
import io.ktor.server.websocket.WebSocketServerSession
import io.ktor.server.websocket.converter
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.eventstream.EventStreamConsumer
import xyz.lebkuchenfm.domain.eventstream.EventStreamConsumerId
import java.util.UUID

private val logger = KotlinLogging.logger {}

class WebSocketEventStream : EventStream<WebSocketConnection>() {
    override suspend fun sendToOne(id: EventStreamConsumerId, event: Event) {
        val connection = subscriptions[id] ?: return

        val converter = checkNotNull(connection.session.converter)
        val dto = event.mapToDto()
        val frame = converter.serialize(dto)

        connection.session.send(frame)
    }

    override fun subscribe(consumer: WebSocketConnection) = super.subscribe(consumer).also {
        logger.info { "User TODO connected to WebSockets event stream." }
    }

    override fun unsubscribe(consumer: WebSocketConnection) = super.unsubscribe(consumer).also {
        logger.info { "User TODO disconnected from WebSockets event stream." }
    }
}

class WebSocketConnection(
    override val id: EventStreamConsumerId = UUID.randomUUID(),
    val session: WebSocketServerSession,
) : EventStreamConsumer
