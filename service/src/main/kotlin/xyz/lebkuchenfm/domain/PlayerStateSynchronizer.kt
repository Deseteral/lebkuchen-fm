package xyz.lebkuchenfm.domain

import io.ktor.util.collections.ConcurrentMap
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.eventstream.EventStreamConsumerId
import java.util.UUID

typealias RequestResponseId = UUID

class PlayerStateSynchronizer<StateT>(
    private val eventStream: EventStream<*>,
    private val defaultStateProvider: DefaultStateProvider<StateT>,
) {
    private val responsePoints: MutableMap<RequestResponseId, EventStreamConsumerId> = ConcurrentMap()

    suspend fun incomingStateSyncRequest(target: EventStreamConsumerId) {
        if (eventStream.subscriptionCount <= 1) {
            // If the client asking for the state is the only one that's connected, then we have to send it the default
            // state - because there is no one else to donate the state.
            eventStream.sendToOne(target, Event.PlayerStateUpdate(defaultStateProvider.getDefaultState()))
        } else {
            // Otherwise ask all receivers (except the one asking) to send their state back to the server.
            val requestId = UUID.randomUUID()
            responsePoints[requestId] = target
            eventStream.sendToEveryone(Event.PlayerStateRequestDonation(requestId), exclude = target)
        }
    }

    suspend fun incomingStateDonation(requestId: RequestResponseId, state: StateT) {
        // If the value is missing then we've already served that state request.
        val target = responsePoints[requestId] ?: return

        eventStream.sendToOne(target, Event.PlayerStateUpdate(state))

        // The request was served so we can remove it from the list.
        responsePoints.remove(requestId)
    }
}

interface DefaultStateProvider<StateT> {
    fun getDefaultState(): StateT
}
