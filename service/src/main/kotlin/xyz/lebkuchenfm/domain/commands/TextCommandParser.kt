package xyz.lebkuchenfm.domain.commands

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.model.Command

private val logger = KotlinLogging.logger {}

class TextCommandParser {
    fun parseFromText(text: String): Result<Command, CommandParsingError> {
        val tokens = text
            .split(' ')
            .map { it.trim() }
            .filter { it.isNotEmpty() }

        if (tokens.isEmpty()) {
            logger.error {
                "Text must contain at least command key to be a valid command. Received '$text'."
            }
            return Err(CommandParsingError.RequiredTokensMissing)
        }

        val key = tokens.first()
        val rawArgs = text
            .substringAfter(key, "")
            .trim()
            .ifBlank { null }

        return Ok(Command(key, rawArgs))
    }
}

sealed class CommandParsingError {
    data object RequiredTokensMissing : CommandParsingError()
}
