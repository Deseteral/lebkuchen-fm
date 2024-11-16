package xyz.lebkuchenfm.api.eventstream

import io.ktor.serialization.suitableCharset
import io.ktor.server.routing.Route
import io.ktor.server.websocket.converter
import io.ktor.server.websocket.webSocket
import io.ktor.util.reflect.typeInfo
import kotlinx.serialization.SerializationException
import xyz.lebkuchenfm.domain.PlayerStateSynchronizer
import java.util.UUID

fun Route.eventStreamRouting(
    eventStream: WebSocketEventStream,
    playerStateSynchronizer: PlayerStateSynchronizer<PlayerStateDto>,
) {
    webSocket("/event-stream") {
        val connectionId = UUID.randomUUID()
        val connection = Connection(id = connectionId, session = this)
        eventStream.addConnection(connection)

        val converter = checkNotNull(converter)

        for (frame in incoming) {
            val event = try {
                converter.deserialize(call.request.headers.suitableCharset(), typeInfo<EventDto>(), frame)
            } catch (ex: SerializationException) {
                // TODO: Add logging for unknown event types.
                continue
            }

            when (event) {
                is PlayerStateRequestEventDto -> playerStateSynchronizer.incomingStateSyncRequest(connection.id)
                is PlayerStateDonationEventDto -> playerStateSynchronizer.incomingStateDonation(
                    UUID.fromString(event.requestId),
                    event.state,
                )
            }
        }

        eventStream.removeConnection(connection)
    }
}
