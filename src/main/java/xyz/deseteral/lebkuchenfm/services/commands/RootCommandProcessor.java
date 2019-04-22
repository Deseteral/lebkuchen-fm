package xyz.deseteral.lebkuchenfm.services.commands;

import org.springframework.beans.factory.annotation.Autowired;
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
            .orElseGet(RootCommandProcessor::getDefaultResponse);
    }

    private static CommandProcessingResponse getDefaultResponse() {
        return new CommandProcessingResponse("Komenda nie istnieje.");
    }
}
