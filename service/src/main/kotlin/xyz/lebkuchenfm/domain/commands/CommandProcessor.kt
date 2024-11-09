package xyz.lebkuchenfm.domain.commands

import io.github.oshai.kotlinlogging.KLogger
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult

abstract class CommandProcessor(
    val key: String,
    val shortKey: String?,
    val helpMessage: String,
    val exampleUsages: List<String>,
    val parameters: CommandParameters,
) {
    abstract suspend fun execute(command: Command): CommandProcessingResult

    fun error(markdown: String, logger: KLogger, message: String? = null): CommandProcessingResult {
        logger.error { message ?: markdown }
        return CommandProcessingResult.fromMarkdown(markdown)
    }
}

class CommandParameters(
    val parameters: List<CommandParameter>,
    val delimiter: String = " ",
) {
    abstract class CommandParameter(
        val required: Boolean,
        val names: List<String>,
    )

    class RequiredCommandParameter(name: String) : CommandParameter(required = true, names = listOf(name))

    class OptionalCommandParameter(name: String) : CommandParameter(required = false, names = listOf(name))

    class RequiredMultiValue(vararg names: String) : CommandParameter(required = true, names.toList())

    class OptionalMultiValue(vararg names: String) : CommandParameter(required = false, names.toList())
}
