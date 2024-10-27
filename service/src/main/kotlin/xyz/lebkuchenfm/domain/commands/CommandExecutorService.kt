package xyz.lebkuchenfm.domain.commands

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult

private val logger = KotlinLogging.logger {}

class CommandExecutorService(
    private val parser: TextCommandParser,
    private val registry: CommandProcessorRegistry,
) {
    private fun execute(command: Command): CommandProcessingResult {
        val processor =
            registry.getProcessorByKey(command.key)
                ?: return CommandProcessingResult.fromMarkdown("Komenda ${command.key} nie istnieje.")

        return try {
            processor.execute(command)
        } catch (ex: Exception) {
            // TODO: Handle errors.
            return CommandProcessingResult.fromMarkdown("Popsuło się.")
        }
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
