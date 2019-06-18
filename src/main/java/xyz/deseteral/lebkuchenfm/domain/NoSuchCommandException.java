package xyz.deseteral.lebkuchenfm.domain;

public class NoSuchCommandException extends RuntimeException {
    public NoSuchCommandException(Command command) {
        super(String.format("Command '%s' does not exist", command.getKey()));
    }
}
