package xyz.lebkuchenfm.api.eventstream

import io.ktor.serialization.suitableCharset
import io.ktor.server.routing.Route
import io.ktor.server.websocket.converter
import io.ktor.server.websocket.webSocket
import io.ktor.util.reflect.typeInfo
import xyz.lebkuchenfm.domain.eventstream.Event

fun Route.eventStreamRouting(eventStream: WebSocketEventStream) {
    webSocket("/event-stream") {
        val connection = Connection(this)
        eventStream.addConnection(connection)

        for (frame in incoming) {
            // TODO: This does not work yet, but I fix it when there are actual events coming from the client.
            val event = converter?.deserialize(call.request.headers.suitableCharset(), typeInfo<Event>(), frame)
            println(event)
        }

        eventStream.removeConnection(connection)
    }
}
