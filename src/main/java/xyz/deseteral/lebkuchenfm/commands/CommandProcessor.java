package xyz.deseteral.lebkuchenfm.commands;

import xyz.deseteral.lebkuchenfm.domain.Command;
import xyz.deseteral.lebkuchenfm.domain.CommandProcessingResponse;

import java.util.List;
import java.util.Optional;

interface CommandProcessor {
    CommandProcessingResponse process(List<String> args);
    String getKey();
    Optional<String> getShortKey();
    String getHelpMessage();

    default boolean matches(Command command) {
        return (
            this.getKey().equals(command.getKey()) ||
                this.getShortKey().isPresent() && this.getShortKey().get().equals(command.getKey())
        );
    }
}
