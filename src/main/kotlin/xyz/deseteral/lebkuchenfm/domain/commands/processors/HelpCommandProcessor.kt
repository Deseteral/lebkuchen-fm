package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.springframework.stereotype.Component
import xyz.deseteral.lebkuchenfm.domain.commands.CommandProcessor
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse

@Component
internal class HelpCommandProcessor(val commandProcessors: List<CommandProcessor>) : CommandProcessor {
    override val key: String
        get() = "help"

    override val shortKey: String?
        get() = null

    override val helpMessage: String
        get() = "Pokazuje tę wiadomość ;)"

    override fun process(args: List<String>): CommandProcessingResponse {
        val list = mutableListOf<CommandProcessor>();
        list.addAll(commandProcessors)
        list.add(this)
        list.sortBy { it.key }

        val commandHelpMessages = list.joinToString("\n") { "- ${it.key}: ${it.helpMessage}" }

        return CommandProcessingResponse(listOf(
            "Lista komend:",
            commandHelpMessages
        ).joinToString("\n"))
    }
}
