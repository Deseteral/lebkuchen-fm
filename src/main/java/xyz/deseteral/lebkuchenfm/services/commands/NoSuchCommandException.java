package xyz.deseteral.lebkuchenfm.services.commands;

import xyz.deseteral.lebkuchenfm.domain.Command;

public class NoSuchCommandException extends RuntimeException {
    public NoSuchCommandException(Command command) {
        super(String.format("Komenda '%s' nie istnieje.", command.getKey()));
    }
}
