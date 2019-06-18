package xyz.deseteral.lebkuchenfm.domain;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CommandExecutor {
    private final List<CommandProcessor> commandProcessors;

    public CommandExecutor(List<CommandProcessor> commandProcessors) {
        this.commandProcessors = List.copyOf(commandProcessors);
    }

    public CommandProcessingResponse process(Command command) {
        return commandProcessors.stream()
            .filter(processor -> processor.matches(command))
            .findFirst()
            .map(processor -> processor.process(command.getArgs()))
            .orElseThrow(() -> new NoSuchCommandProcessorException(command));
    }

    public CommandProcessingResponse processFromText(String commandText) {
        return CommandParser.parse(commandText)
            .map(this::process)
            .orElseThrow(() -> new TextIsNotACommandException(commandText));
    }
}
