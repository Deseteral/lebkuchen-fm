package xyz.lebkuchenfm.api.eventstream

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.serialization.serialize
import io.ktor.server.websocket.WebSocketServerSession
import io.ktor.server.websocket.converter
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import java.util.Collections

class Connection(val session: WebSocketServerSession)

private val logger = KotlinLogging.logger {}

class WebSocketEventStream : EventStream {
    private val connections = Collections.synchronizedSet<Connection>(LinkedHashSet())

    override suspend fun sendToEveryone(event: Event) {
        connections.forEach { connection ->
            val dto = event.mapToDto()
            val converter = checkNotNull(connection.session.converter)
            val frame = converter.serialize(dto)
            connection.session.send(frame)
        }
    }

    fun addConnection(connection: Connection) {
        connections += connection
        logger.info { "User TODO connected to WebSockets event stream." }
    }

    fun removeConnection(connection: Connection) {
        connections.remove(connection)
        logger.info { "User TODO disconnected from WebSockets event stream." }
    }
}
