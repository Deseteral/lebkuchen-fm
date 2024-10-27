package xyz.lebkuchenfm.domain.commands

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult

private val logger = KotlinLogging.logger {}

class CommandExecutorService(
    private val parser: TextCommandParser,
    private val registry: CommandProcessorRegistry,
    private val commandPrompt: String,
) {
    private fun execute(command: Command): CommandProcessingResult {
        val processor = registry.getProcessorByKey(command.key)
            ?: return CommandProcessingResult.fromMarkdown("Command ${command.key} does not exist.")

        return try {
            processor.execute(command)
        } catch (ex: Exception) {
            logger.error(ex) { "There was a problem when executing $command." }
            return CommandProcessingResult.fromMarkdown(ex.message ?: "Could not process command.")
        }
    }

    fun executeFromText(text: String): CommandProcessingResult {
        val command = try {
            parser.parseFromText(text)
        } catch (ex: Exception) {
            logger.error(ex) { "Could not parse command '$text'." }
            return CommandProcessingResult.fromMultilineMarkdown(
                ex.message ?: "Could not parse command `$text`.",
                "For more information checkout `$commandPrompt help`.",
            )
        }

        return execute(command)
    }
}
