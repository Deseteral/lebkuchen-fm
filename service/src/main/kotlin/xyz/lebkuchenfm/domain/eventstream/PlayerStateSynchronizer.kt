package xyz.lebkuchenfm.domain.eventstream

import io.ktor.util.collections.ConcurrentMap
import kotlinx.coroutines.delay
import kotlin.time.Duration.Companion.seconds

class PlayerStateSynchronizer<StateT>(
    private val eventStream: EventStream<*>,
    private val defaultStateProvider: DefaultStateProvider<StateT>,
) {
    private val requestHandles: MutableMap<Event.PlayerStateRequestDonation.RequestHandle, DonationRequest> =
        ConcurrentMap()

    suspend fun incomingStateSyncRequest(target: EventStreamConsumerId) {
        if (eventStream.subscriptionCount <= 1) {
            // If the client asking for the state is the only one that's connected, then we have to send it the default
            // state - because there is no one else to donate the state.
            eventStream.sendToOne(target, Event.PlayerStateUpdate(defaultStateProvider.getDefaultState()))
        } else {
            // Otherwise ask all receivers (except the one asking) to send their state back to the server.
            val handle = Event.PlayerStateRequestDonation.RequestHandle()
            val sentCount = eventStream.sendToEveryone(Event.PlayerStateRequestDonation(handle), exclude = target)
            requestHandles[handle] = DonationRequest(target, awaitingResponseCount = sentCount)

            // Give time for clients to donate their state.
            delay(stateDonationResponseTimeout)

            // If none of the clients donated state in the allowed time - respond with default state.
            if (handle in requestHandles) {
                eventStream.sendToOne(target, Event.PlayerStateUpdate(defaultStateProvider.getDefaultState()))
                requestHandles.remove(handle)
            }
        }
    }

    suspend fun incomingStateDonation(handle: Event.PlayerStateRequestDonation.RequestHandle, state: StateT?) {
        // If the value is missing then we've already served that state request.
        val request = requestHandles[handle] ?: return

        request.awaitingResponseCount -= 1

        // When we get the state - just send it to target.
        // When we don't get the state, and we have no one else to wait for - send default state.
        // Otherwise, don't send anything - we're still waiting for donors to respond.
        val actualState = when {
            state != null -> state
            request.awaitingResponseCount == 0 -> defaultStateProvider.getDefaultState()
            else -> return
        }

        eventStream.sendToOne(request.target, Event.PlayerStateUpdate(actualState))

        // The request was served so we can remove it from the list.
        requestHandles.remove(handle)
    }

    interface DefaultStateProvider<StateT> {
        fun getDefaultState(): StateT
    }

    private class DonationRequest(
        val target: EventStreamConsumerId,
        var awaitingResponseCount: Int,
    )

    companion object {
        private val stateDonationResponseTimeout: Long = 1.seconds.inWholeMilliseconds
    }
}
