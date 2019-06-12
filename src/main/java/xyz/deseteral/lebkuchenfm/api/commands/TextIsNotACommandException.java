package xyz.deseteral.lebkuchenfm.api.commands;

final class TextIsNotACommandException extends RuntimeException {
    TextIsNotACommandException(String text) {
        super(String.format("Text '%s' is not a command", text));
    }
}
