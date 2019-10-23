package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.springframework.stereotype.Component
import xyz.deseteral.lebkuchenfm.domain.commands.CommandProcessor
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse
import xyz.deseteral.lebkuchenfm.domain.commands.model.SingleMessageResponse

@Component
internal class PingCommandProcessor : CommandProcessor {
    override val key: String
        get() = "ping"

    override val shortKey: String?
        get() = "p"

    override val helpMessage: String
        get() = "Ping pongs you"

    override fun process(args: List<String>): CommandProcessingResponse {
        return SingleMessageResponse("pong")
    }
}
