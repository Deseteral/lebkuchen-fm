package xyz.lebkuchenfm.domain.commands

import xyz.lebkuchenfm.domain.commands.model.Command

class TextCommandParser(private val commandPrompt: String) {
    fun parseFromText(text: String): Command {
        val tokens =
            text.split(' ')
                .map { it.trim() }
                .filter { it.isNotEmpty() }

        require(tokens.size >= 2) { "Text must contain prompt and command key to be a valid command." }

        val (prompt, key) = tokens
        require(prompt == commandPrompt) {
            "First token must be the command prompt. Expected $commandPrompt, got $prompt."
        }

        val rawArgs =
            text
                .substringAfter(key, "")
                .trim()
                .ifBlank { null }

        return Command(key, rawArgs)
    }
}
