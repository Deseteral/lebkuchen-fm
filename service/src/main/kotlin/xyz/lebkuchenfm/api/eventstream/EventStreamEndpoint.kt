package xyz.lebkuchenfm.api.eventstream

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.serialization.serialize
import io.ktor.serialization.suitableCharset
import io.ktor.server.routing.Route
import io.ktor.server.websocket.converter
import io.ktor.server.websocket.webSocket
import io.ktor.util.reflect.typeInfo
import kotlinx.serialization.SerializationException

private val logger = KotlinLogging.logger {}

fun Route.eventStreamRouting(eventStream: WebSocketEventStream) {
    webSocket("/event-stream") {
        val connection = WebSocketConnection(session = this)
        eventStream.subscribe(connection)

        val converter = checkNotNull(converter)

        for (frame in incoming) {
            val event = try {
                converter.deserialize(call.request.headers.suitableCharset(), typeInfo<EventDto>(), frame)
            } catch (ex: SerializationException) {
                logger.error(ex) { "Could not parse incoming WebSocket event." }
                continue
            }

            when (event) {
                is PlayerStateRequestEventDto -> {
                    send(converter.serialize(PlayerStateUpdateEventDto()))
                }
            }

        }

        eventStream.unsubscribe(connection)
    }
}
