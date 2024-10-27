package xyz.lebkuchenfm.domain.commands

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.model.Command

private val logger = KotlinLogging.logger {}

class TextCommandParser(private val commandPrompt: String) {
    fun parseFromText(text: String): Command {
        val tokens = text
            .split(' ')
            .map { it.trim() }
            .filter { it.isNotEmpty() }

        val prompt = tokens.first()
        require(prompt == commandPrompt) {
            logger.error { "First token must be the command prompt. Expected '$commandPrompt', got '$prompt'." }
            "Given text is not a command."
        }
        require(tokens.size >= 2) {
            logger.error { "Text must contain prompt and command key to be a valid command. Received '$text'." }
            "The command must perform some action."
        }

        val (_, key) = tokens
        val rawArgs = text
            .substringAfter(key, "")
            .trim()
            .ifBlank { null }

        return Command(key, rawArgs)
    }
}
