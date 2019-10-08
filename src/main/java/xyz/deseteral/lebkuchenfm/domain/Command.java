package xyz.deseteral.lebkuchenfm.domain;

import java.util.Collections;
import java.util.List;

final class Command {
    private final String key;
    private final List<String> args;

    Command(String key, List<String> args) {
        this.key = key;
        this.args = List.copyOf(args);
    }

    String getKey() {
        return key;
    }

    List<String> getArgs() {
        return Collections.unmodifiableList(args);
    }

    boolean matchProcessor(CommandProcessor commandProcessor) {
        final boolean keyMatch = commandProcessor.getKey().equals(this.key);
        final boolean shortKeyMatch = commandProcessor.getShortKey()
            .map(shortKey -> shortKey.equals(this.key))
            .orElse(false);

        return (keyMatch || shortKeyMatch);
    }
}
