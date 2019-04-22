package xyz.deseteral.lebkuchenfm.api.commands;

public class TextIsNotACommandException extends RuntimeException {
    public TextIsNotACommandException() {
        super("Given text is not a command");
    }
}
