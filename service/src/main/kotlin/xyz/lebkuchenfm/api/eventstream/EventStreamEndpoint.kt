package xyz.lebkuchenfm.api.eventstream

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.serialization.suitableCharset
import io.ktor.server.routing.Route
import io.ktor.server.websocket.converter
import io.ktor.server.websocket.webSocket
import io.ktor.util.reflect.typeInfo
import kotlinx.serialization.SerializationException
import xyz.lebkuchenfm.api.eventstream.models.EventDto
import xyz.lebkuchenfm.api.eventstream.models.PlayerStateDonationEventDto
import xyz.lebkuchenfm.api.eventstream.models.PlayerStateDto
import xyz.lebkuchenfm.api.eventstream.models.PlayerStateRequestEventDto
import xyz.lebkuchenfm.domain.PlayerStateSynchronizer
import xyz.lebkuchenfm.domain.eventstream.Event

private val logger = KotlinLogging.logger {}

fun Route.eventStreamRouting(
    eventStream: WebSocketEventStream,
    playerStateSynchronizer: PlayerStateSynchronizer<PlayerStateDto>,
) {
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
                is PlayerStateRequestEventDto -> playerStateSynchronizer.incomingStateSyncRequest(connection.id)
                is PlayerStateDonationEventDto -> playerStateSynchronizer.incomingStateDonation(
                    Event.PlayerStateRequestDonation.RequestHandle(event.requestHandle),
                    event.state,
                )
            }
        }

        eventStream.unsubscribe(connection)
    }
}
