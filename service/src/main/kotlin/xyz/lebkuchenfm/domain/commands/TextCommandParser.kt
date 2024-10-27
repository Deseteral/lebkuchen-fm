package xyz.lebkuchenfm.domain.commands

import xyz.lebkuchenfm.domain.commands.model.Command

class TextCommandParser(private val commandPrompt: String) {
    fun parseFromText(text: String): Command {
        val tokens = text
            .split(' ')
            .map { it.trim() }
            .filter { it.isNotEmpty() }

        val prompt = tokens.first()
        require(prompt == commandPrompt) { "Given text is not a command. Expected $commandPrompt, got $prompt." }
        require(tokens.size >= 2) { "The command must perform some action." }

        val (_, key) = tokens
        val rawArgs = text
            .substringAfter(key, "")
            .trim()
            .ifBlank { null }

        return Command(key, rawArgs)
    }
}
