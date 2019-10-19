package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.springframework.stereotype.Component
import xyz.deseteral.lebkuchenfm.domain.commands.CommandProcessor
import xyz.deseteral.lebkuchenfm.domain.commands.model.Command
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse

@Component
internal class PingCommandProcessor : CommandProcessor {
    override val key: String
        get() = "ping"

    override val shortKey: String?
        get() = "p"

    override val helpMessage: String
        get() = "Ping pongs you"

    override fun process(command: Command): CommandProcessingResponse {
        return CommandProcessingResponse("pong")
    }
}
