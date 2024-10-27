package xyz.lebkuchenfm.domain.commands

import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult

abstract class CommandProcessor(
    val key: String,
    val shortKey: String?,
    val helpMessage: String,
    val exampleUsages: List<String>,
    val parameters: CommandParameters,
) {
    abstract fun execute(command: Command): CommandProcessingResult
}

class CommandParameters(
    val parameters: List<CommandParameter>,
    val delimiter: String? = null,
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
