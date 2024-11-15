package xyz.lebkuchenfm.api.eventstream

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.serialization.serialize
import io.ktor.server.websocket.WebSocketServerSession
import io.ktor.server.websocket.converter
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.eventstream.EventStreamClientId

class Connection(
    val id: EventStreamClientId,
    val session: WebSocketServerSession,
)

private val logger = KotlinLogging.logger {}

class WebSocketEventStream : EventStream<Connection>() {
    override suspend fun sendToOne(id: EventStreamClientId, event: Event) {
        val connection = clients[id] ?: return

        val dto = event.mapToDto()
        val converter = checkNotNull(connection.session.converter)
        val frame = converter.serialize(dto)

        connection.session.send(frame)
    }

    // TODO: This should be extracted to the base class.
    fun addConnection(connection: Connection) {
        clients[connection.id] = connection
        logger.info { "User TODO connected to WebSockets event stream." }
    }

    // TODO: This should be extracted to the base class.
    fun removeConnection(connection: Connection) {
        clients.remove(connection.id)
        logger.info { "User TODO disconnected from WebSockets event stream." }
    }
}
