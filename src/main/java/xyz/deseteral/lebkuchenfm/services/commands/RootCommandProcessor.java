package xyz.deseteral.lebkuchenfm.services.commands;

import org.springframework.stereotype.Component;
import xyz.deseteral.lebkuchenfm.domain.Command;
import xyz.deseteral.lebkuchenfm.domain.CommandProcessingResponse;

import java.util.List;

@Component
public class RootCommandProcessor {
    private final List<CommandProcessor> commandProcessors;

    public RootCommandProcessor(List<CommandProcessor> commandProcessors) {
        this.commandProcessors = commandProcessors;
    }

    public CommandProcessingResponse process(Command command) {
        return commandProcessors
            .stream()
            .filter(processor -> processor.matches(command))
            .findFirst()
            .map(processor -> processor.process(command.getArgs()))
            .orElseThrow(() -> new NoSuchCommandException(command));
    }
}
