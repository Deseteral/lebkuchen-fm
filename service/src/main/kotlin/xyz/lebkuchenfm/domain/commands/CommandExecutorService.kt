package xyz.lebkuchenfm.domain.commands

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.model.Command

private val logger = KotlinLogging.logger {}

class CommandExecutorService(private val parser: TextCommandParser) {
    fun execute(command: Command): CommandProcessingResult {
        return CommandProcessingResult(message = CommandProcessingResult.CommandProcessingResultMessage("Bang"))
    }

    fun executeFromText(text: String): CommandProcessingResult {
        val command =
            try {
                parser.parseFromText(text)
            } catch (ex: Exception) {
                logger.error(ex) { "Could not parse command \"$text\"." }
                null
            }

        return command?.let { execute(it) }
            ?: CommandProcessingResult.fromMarkdown("Wystąpił błąd podczas procesowania komendy.")
    }
}
