package xyz.lebkuchenfm.external

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream

private val logger = KotlinLogging.logger {}

/*
 * This is a dummy event stream implementation just for tests.
 */
class DummyEventStream : EventStream {
    override fun sendToEveryone(event: Event) {
        logger.info { "Event sent: $event" }
    }
}
