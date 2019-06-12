package xyz.deseteral.lebkuchenfm.api.commands;

public class TextIsNotACommandException extends RuntimeException {
    public TextIsNotACommandException(String text) {
        super(String.format("Text '%s' is not a command", text));
    }
}
