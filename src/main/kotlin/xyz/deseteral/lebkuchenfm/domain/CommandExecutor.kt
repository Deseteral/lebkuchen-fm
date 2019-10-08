package xyz.deseteral.lebkuchenfm.domain

import org.springframework.stereotype.Component

@Component
class CommandExecutor(commandProcessors: List<CommandProcessor>) {
    private val commandProcessors: List<CommandProcessor>

    init {
        this.commandProcessors = List.copyOf<CommandProcessor>(commandProcessors)
    }

    fun process(command: Command): CommandProcessingResponse {
        return commandProcessors.stream()
                .filter { processor -> command.matchProcessor(processor) }
                .findFirst()
                .map { processor -> processor.process(command.args) }
                .orElseThrow { NoSuchCommandProcessorException(command) }
    }

    fun processFromText(commandText: String): CommandProcessingResponse {
        return CommandParser.parse(commandText)
                .map<CommandProcessingResponse>(Function<Command, CommandProcessingResponse> { this.process(it) })
                .orElseThrow { TextIsNotACommandException(commandText) }
    }
}
