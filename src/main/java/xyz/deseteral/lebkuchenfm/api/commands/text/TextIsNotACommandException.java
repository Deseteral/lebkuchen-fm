package xyz.deseteral.lebkuchenfm.api.commands.text;

final class TextIsNotACommandException extends RuntimeException {
    TextIsNotACommandException(String text) {
        super(String.format("Text '%s' is not a command", text));
    }
}
