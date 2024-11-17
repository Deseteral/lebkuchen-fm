package xyz.lebkuchenfm.domain.commands

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.model.Command

private val logger = KotlinLogging.logger {}

class TextCommandParser(private val commandPrompt: String) {
    fun parseFromText(text: String): Result<Command, CommandParsingError> {
        val tokens = text
            .split(' ')
            .map { it.trim() }
            .filter { it.isNotEmpty() }

        val prompt = tokens.first()

        if (prompt != commandPrompt) {
            logger.error { "First token must be the command prompt. Expected '$commandPrompt', got '$prompt'." }
            return Err(CommandParsingError.IncorrectPrompt)
        }
        if (tokens.size < 2) {
            logger.error {
                "Text must contain at least prompt and command key to be a valid command. Received '$text'."
            }
            return Err(CommandParsingError.RequiredTokensMissing)
        }

        val (_, key) = tokens
        val rawArgs = text
            .substringAfter(key, "")
            .trim()
            .ifBlank { null }

        return Ok(Command(key, rawArgs))
    }
}

sealed interface CommandParsingError {
    data object IncorrectPrompt : CommandParsingError
    data object RequiredTokensMissing : CommandParsingError
}
