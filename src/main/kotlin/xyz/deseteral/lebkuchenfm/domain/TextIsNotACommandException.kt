package xyz.deseteral.lebkuchenfm.domain

class TextIsNotACommandException(text: String) : RuntimeException(String.format("Text '%s' is not a command", text))
