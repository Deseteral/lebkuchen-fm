package xyz.lebkuchenfm.domain.commands

import com.github.michaelbull.result.getOrElse
import com.github.michaelbull.result.map
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

        return processor.execute(command)
    }

    fun executeFromText(text: String): CommandProcessingResult {
        return parser.parseFromText(text)
            .map { execute(it) }
            .getOrElse { err ->
                logger.error { "Could not parse command '$text'." }
                CommandProcessingResult.fromMultilineMarkdown(
                    when (err) {
                        CommandParsingError.IncorrectPrompt -> "Given text is not a command."
                        CommandParsingError.RequiredTokensMissing -> "The command must perform some action."
                    },
                    "For more information checkout `$commandPrompt help`.",
                )
            }
    }
}
