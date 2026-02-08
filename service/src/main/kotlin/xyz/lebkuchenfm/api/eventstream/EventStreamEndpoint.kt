package xyz.lebkuchenfm.api.eventstream

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.serialization.WebsocketContentConverter
import io.ktor.serialization.suitableCharset
import io.ktor.server.auth.principal
import io.ktor.server.routing.Route
import io.ktor.server.websocket.DefaultWebSocketServerSession
import io.ktor.server.websocket.converter
import io.ktor.server.websocket.webSocket
import io.ktor.util.reflect.typeInfo
import io.ktor.websocket.CloseReason
import io.ktor.websocket.Frame
import io.ktor.websocket.close
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.launch
import kotlinx.coroutines.selects.select
import kotlinx.serialization.SerializationException
import xyz.lebkuchenfm.api.eventstream.models.EventDto
import xyz.lebkuchenfm.api.eventstream.models.PlayerStateDonationEventDto
import xyz.lebkuchenfm.api.eventstream.models.PlayerStateDto
import xyz.lebkuchenfm.api.eventstream.models.PlayerStateRequestEventDto
import xyz.lebkuchenfm.domain.auth.InvalidationFlow
import xyz.lebkuchenfm.domain.auth.UserSession
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.PlayerStateSynchronizer

private val logger = KotlinLogging.logger {}

fun Route.eventStreamRouting(
    eventStream: WebSocketEventStream,
    playerStateSynchronizer: PlayerStateSynchronizer<PlayerStateDto>,
) {
    webSocket("/event-stream") {
        val connection = WebSocketConnection(session = this)
        eventStream.subscribe(connection)

        val converter = checkNotNull(converter)

        val userSession = call.principal<UserSession>() ?: run {
            close(CloseReason(CloseReason.Codes.VIOLATED_POLICY, "Unauthorized"))
            return@webSocket
        }

        val stopSignal = Channel<Unit>(capacity = 1)

        try {
            launch {
                InvalidationFlow.subscribe(userSession.name).collect {
                    runCatching { close(CloseReason(CloseReason.Codes.NORMAL, "Session invalidated")) }
                    stopSignal.trySend(Unit)
                }
            }

            frameProcessing@ for (frame in incoming) {
                val continueProcessing = select<Boolean> {
                    stopSignal.onReceive { false }
                    incoming.onReceiveCatching { true }
                }

                if (!continueProcessing) break@frameProcessing

                handleFrame(frame, connection, converter, playerStateSynchronizer)
            }
        } finally {
            eventStream.unsubscribe(connection)
        }
    }
}

private suspend fun DefaultWebSocketServerSession.handleFrame(
    frame: Frame,
    connection: WebSocketConnection,
    converter: WebsocketContentConverter,
    playerStateSynchronizer: PlayerStateSynchronizer<PlayerStateDto>,
) {
    if (frame !is Frame.Text) return

    val event = try {
        converter.deserialize(call.request.headers.suitableCharset(), typeInfo<EventDto>(), frame)
    } catch (ex: SerializationException) {
        logger.error(ex) { "Could not parse incoming WebSocket event." }
        return
    }

    when (event) {
        is PlayerStateRequestEventDto -> playerStateSynchronizer.incomingStateSyncRequest(connection.id)
        is PlayerStateDonationEventDto -> playerStateSynchronizer.incomingStateDonation(
            Event.PlayerStateRequestDonation.RequestHandle(event.requestHandle),
            event.state,
        )
    }
}
