package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.springframework.stereotype.Component
import xyz.deseteral.lebkuchenfm.domain.commands.CommandProcessor
import xyz.deseteral.lebkuchenfm.domain.commands.model.Command
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse
import xyz.deseteral.lebkuchenfm.domain.commands.model.Message
import xyz.deseteral.lebkuchenfm.domain.commands.model.MessageType
import xyz.deseteral.lebkuchenfm.domain.commands.model.MultiMessageResponse

@Component
internal class HelpCommandProcessor(commandProcessors: List<CommandProcessor>) : CommandProcessor {
    private final val processors: List<CommandProcessor>

    init {
        val list = mutableListOf<CommandProcessor>()
        list.addAll(commandProcessors)
        list.add(this)
        list.sortBy { it.key }

        this.processors = list.toList()
    }

    override val key: String
        get() = "help"

    override val shortKey: String?
        get() = null

    override val helpMessage: String
        get() = "Pokazuje tę wiadomość ;)"

    override fun process(command: Command): CommandProcessingResponse {
        val messages = listOf(Message("Lista komend:", MessageType.HEADER))
            .plus(
                processors.map {
                        val shortKeyText = if (it.shortKey != null) " [${it.shortKey}]" else ""
                        "${it.key}$shortKeyText: ${it.helpMessage}"
                    }
                    .map { Message(it, MessageType.PLAIN_TEXT) }
            )

        return MultiMessageResponse(messages)
    }
}
