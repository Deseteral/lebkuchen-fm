package xyz.deseteral.lebkuchenfm.domain.commands

import org.springframework.stereotype.Component
import xyz.deseteral.lebkuchenfm.domain.commands.model.Command
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse
import xyz.deseteral.lebkuchenfm.domain.commands.model.matchProcessor
import xyz.deseteral.lebkuchenfm.domain.commands.parser.TextCommandParser

@Component
class CommandExecutorService(val commandProcessors: List<CommandProcessor>) {
    fun process(command: Command): CommandProcessingResponse = commandProcessors
        .firstOrNull { processor -> matchProcessor(command, processor) }
        ?.process(command.args)
        ?: throw NoSuchCommandProcessorException(command)

    fun processFromText(commandText: String): CommandProcessingResponse {
        val command = TextCommandParser.parse(commandText)
        return this.process(command)
    }
}
