package xyz.deseteral.lebkuchenfm.domain.commands.parser

class TextIsNotACommandException(text: String)
    : RuntimeException(String.format("Text '%s' is not a command", text))
