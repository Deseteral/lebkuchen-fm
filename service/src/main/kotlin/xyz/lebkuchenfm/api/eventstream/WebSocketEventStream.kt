package xyz.lebkuchenfm.api.eventstream

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.websocket.DefaultWebSocketSession
import io.ktor.websocket.Frame
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.ClassDiscriminatorMode
import kotlinx.serialization.json.Json
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import java.util.Collections

class Connection(val session: DefaultWebSocketSession)

private val logger = KotlinLogging.logger {}

class WebSocketEventStream : EventStream {
    private val connections = Collections.synchronizedSet<Connection?>(LinkedHashSet())

    @OptIn(ExperimentalSerializationApi::class)
    private val json = Json {
        encodeDefaults = true
        classDiscriminatorMode = ClassDiscriminatorMode.NONE
    }

    override suspend fun sendToEveryone(event: Event) {
        connections.forEach {
            val dto = event.mapToDto()
            val text = json.encodeToString(dto)
            it.session.send(Frame.Text(text))
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
