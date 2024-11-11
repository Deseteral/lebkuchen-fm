package xyz.lebkuchenfm.api.eventstream

import io.ktor.serialization.serialize
import io.ktor.serialization.suitableCharset
import io.ktor.server.routing.Route
import io.ktor.server.websocket.converter
import io.ktor.server.websocket.webSocket
import io.ktor.util.reflect.typeInfo

fun Route.eventStreamRouting(eventStream: WebSocketEventStream) {
    webSocket("/event-stream") {
        val connection = Connection(this)
        eventStream.addConnection(connection)

        val converter = checkNotNull(converter)

        for (frame in incoming) {
            val event = converter.deserialize(call.request.headers.suitableCharset(), typeInfo<EventDto>(), frame)

            val responseEvent = when (event) {
                is PlayerStateRequestEventDto -> PlayerStateUpdateEventDto()
                else -> null
            }

            responseEvent?.let { send(converter.serialize(it)) }
        }

        eventStream.removeConnection(connection)
    }
}
