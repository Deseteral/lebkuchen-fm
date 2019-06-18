package xyz.deseteral.lebkuchenfm.domain;

public class NoSuchCommandProcessorException extends RuntimeException {
    public NoSuchCommandProcessorException(Command command) {
        super(String.format("Command '%s' does not exist", command.getKey()));
    }
}
