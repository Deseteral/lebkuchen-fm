package xyz.deseteral.lebkuchenfm.domain

import org.springframework.stereotype.Component

@Component
class CommandExecutor(val commandProcessors: List<CommandProcessor>) {
    fun process(command: Command): CommandProcessingResponse = commandProcessors
        .firstOrNull { processor -> matchProcessor(command, processor) }
        ?.process(command.args)
        ?: throw NoSuchCommandProcessorException(command)

    fun processFromText(commandText: String): CommandProcessingResponse {
        val command = CommandParser.parse(commandText)

        if (command != null) {
            return this.process(command)
        } else {
            throw TextIsNotACommandException(commandText)
        }
    }
}
