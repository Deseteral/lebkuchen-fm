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
    private suspend fun execute(command: Command, context: ExecutionContext): CommandProcessingResult {
        val processor = registry.getProcessorByKey(command.key)
            ?: return CommandProcessingResult.fromMarkdown("Command ${command.key} does not exist.")

        // Check scope requirements
        if (processor.requiredScope != null && processor.requiredScope !in context.scopes) {
            val message = "You don't have permission to use command '${command.key}'. " +
                "Required scope: '${processor.requiredScope.value}'."
            return CommandProcessingResult.fromMarkdown(message)
        }

        return processor.execute(command, context)
    }

    suspend fun executeFromText(text: String, context: ExecutionContext): CommandProcessingResult {
        return parser.parseFromText(text).map { execute(it, context) }.getOrElse { err ->
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
