package xyz.deseteral.lebkuchenfm.domain;

public final class TextIsNotACommandException extends RuntimeException {
    public TextIsNotACommandException(String text) {
        super(String.format("Text '%s' is not a command", text));
    }
}
