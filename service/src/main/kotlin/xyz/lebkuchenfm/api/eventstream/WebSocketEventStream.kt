package xyz.lebkuchenfm.api.eventstream

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.serialization.serialize
import io.ktor.server.websocket.WebSocketServerSession
import io.ktor.server.websocket.converter
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.eventstream.EventStreamClient
import xyz.lebkuchenfm.domain.eventstream.EventStreamClientId

class Connection(
    override val id: EventStreamClientId,
    val session: WebSocketServerSession,
) : EventStreamClient

private val logger = KotlinLogging.logger {}

class WebSocketEventStream : EventStream<Connection>() {
    override suspend fun sendToOne(id: EventStreamClientId, event: Event) {
        val connection = clients[id] ?: return

        val converter = checkNotNull(connection.session.converter)
        val dto = event.mapToDto()
        val frame = converter.serialize(dto)

        connection.session.send(frame)
    }

    override fun addConnection(client: Connection) = super.addConnection(client).also {
        logger.info { "User TODO connected to WebSockets event stream." }
    }

    override fun removeConnection(client: Connection) = super.removeConnection(client).also {
        logger.info { "User TODO disconnected from WebSockets event stream." }
    }
}
