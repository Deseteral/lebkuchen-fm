package xyz.deseteral.lebkuchenfm.commands;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import xyz.deseteral.lebkuchenfm.domain.Command;
import xyz.deseteral.lebkuchenfm.domain.CommandProcessingResponse;

import java.util.List;

@Component
public class CommandResolver {
    private final List<CommandProcessor> commandProcessors;

    @Autowired
    public CommandResolver(List<CommandProcessor> commandProcessors) {
        this.commandProcessors = commandProcessors;
    }

    public CommandProcessingResponse resolve(Command command) {
        return commandProcessors
            .stream()
            .filter(processor -> doesCommandQualify(processor, command))
            .findFirst()
            .map(processor -> processor.process(command.getArgs()))
            .orElseGet(CommandResolver::getDefaultResponse);
    }

    private boolean doesCommandQualify(CommandProcessor processor, Command command) {
        return (
            processor.getKey().equals(command.getKey()) ||
                processor.getShortKey().isPresent() && processor.getShortKey().get().equals(command.getKey())
        );
    }

    private static CommandProcessingResponse getDefaultResponse() {
        return new CommandProcessingResponse("Komenda nie istnieje.");
    }
}
