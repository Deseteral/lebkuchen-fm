package xyz.deseteral.lebkuchenfm.domain

import org.springframework.stereotype.Component
import java.util.Optional

@Component
internal class PingCommandProcessor : CommandProcessor {

    override val key: String
        get() = "ping"

    override val shortKey: Optional<String>
        get() = Optional.empty()

    override val helpMessage: String
        get() = "Ping pongs you"

    override fun process(args: List<String>): CommandProcessingResponse {
        return CommandProcessingResponse("pong")
    }
}
