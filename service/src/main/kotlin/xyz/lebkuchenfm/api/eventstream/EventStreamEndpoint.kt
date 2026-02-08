package xyz.lebkuchenfm.api.eventstream

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.serialization.suitableCharset
import io.ktor.server.auth.principal
import io.ktor.server.routing.Route
import io.ktor.server.websocket.converter
import io.ktor.server.websocket.webSocket
import io.ktor.util.reflect.typeInfo
import io.ktor.websocket.CloseReason
import io.ktor.websocket.Frame
import io.ktor.websocket.close
import kotlinx.coroutines.launch
import kotlinx.serialization.SerializationException
import xyz.lebkuchenfm.api.eventstream.models.EventDto
import xyz.lebkuchenfm.api.eventstream.models.PlayerStateDonationEventDto
import xyz.lebkuchenfm.api.eventstream.models.PlayerStateDto
import xyz.lebkuchenfm.api.eventstream.models.PlayerStateRequestEventDto
import xyz.lebkuchenfm.domain.auth.SessionInvalidationFlow
import xyz.lebkuchenfm.domain.auth.UserSession
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.PlayerStateSynchronizer

private val logger = KotlinLogging.logger {}

fun Route.eventStreamRouting(
    eventStream: WebSocketEventStream,
    playerStateSynchronizer: PlayerStateSynchronizer<PlayerStateDto>,
) {
    webSocket("/event-stream") {
        val userSession = call.principal<UserSession>() ?: run {
            close(CloseReason(CloseReason.Codes.VIOLATED_POLICY, "Unauthorized"))
            return@webSocket
        }

        val connection = WebSocketConnection(session = this)
        val converter = checkNotNull(converter)

        eventStream.subscribe(connection)

        try {
            launch {
                SessionInvalidationFlow.subscribe(userSession.name).collect {
                    runCatching { close(CloseReason(CloseReason.Codes.NORMAL, "Session invalidated")) }
                }
            }

            for (frame in incoming) {
                if (frame !is Frame.Text) continue

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
        } finally {
            eventStream.unsubscribe(connection)
        }
    }
}
