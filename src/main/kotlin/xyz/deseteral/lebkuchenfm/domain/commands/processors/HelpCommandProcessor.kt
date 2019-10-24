package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.springframework.stereotype.Component
import xyz.deseteral.lebkuchenfm.domain.commands.CommandProcessor
import xyz.deseteral.lebkuchenfm.domain.commands.model.Command
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse

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
        val commandHelpMessages = processors.joinToString("\n") {
            val shortKeyText = if (it.shortKey != null) " [${it.shortKey}]" else ""
            "- ${it.key}${shortKeyText}: ${it.helpMessage}"
        }

        return CommandProcessingResponse(listOf(
            "Lista komend:",
            commandHelpMessages
        ).joinToString("\n"))
    }
}
