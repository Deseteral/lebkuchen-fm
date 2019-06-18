package xyz.deseteral.lebkuchenfm.domain;

import java.util.List;
import java.util.Optional;

interface CommandProcessor {
    CommandProcessingResponse process(List<String> args);

    String getKey();

    Optional<String> getShortKey();

    String getHelpMessage();

    default boolean matches(Command command) {
        final boolean keyMatch = this.getKey().equals(command.getKey());
        final boolean shortKeyMatch = this.getShortKey()
            .map(shortKey -> shortKey.equals(command.getKey()))
            .orElse(false);

        return (keyMatch || shortKeyMatch);
    }
}
