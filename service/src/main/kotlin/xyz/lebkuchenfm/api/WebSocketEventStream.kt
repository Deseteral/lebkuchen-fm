package xyz.lebkuchenfm.api

import dev.kord.core.entity.StageInstance
import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.serialization.suitableCharset
import io.ktor.server.routing.Route
import io.ktor.server.websocket.converter
import io.ktor.server.websocket.webSocket
import io.ktor.util.reflect.typeInfo
import io.ktor.websocket.DefaultWebSocketSession
import io.ktor.websocket.Frame
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import java.util.Collections

fun Route.eventStreamRouting(eventStream: WebSocketEventStream) {
    webSocket("/event-stream") {
        val connection = Connection(this)
        eventStream.addConnection(connection)

        for (frame in incoming) {
            val event = converter?.deserialize(call.request.headers.suitableCharset(), typeInfo<Event>(), frame)
            println(event)
        }

        eventStream.removeConnection(connection)
    }
}

class Connection(val session: DefaultWebSocketSession)

private val logger = KotlinLogging.logger {}
class WebSocketEventStream : EventStream {
    private val connections = Collections.synchronizedSet<Connection?>(LinkedHashSet())

    override suspend fun sendToEveryone(event: Event) {
        connections.forEach {
            val data = Json.encodeToString(event.mapper())
            it.session.send(Frame.Text(data))
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

@Serializable
data class PlayXSoundEventDto(val soundUrl: String)

fun Event.mapper(): String {
    val event = when (this) {
        is Event.PlayXSound -> PlayXSoundEventDto(soundUrl)
    }
    return Json.encodeToString(event)
}
