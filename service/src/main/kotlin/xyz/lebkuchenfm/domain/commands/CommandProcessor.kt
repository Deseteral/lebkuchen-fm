package xyz.lebkuchenfm.domain.commands

import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult

abstract class CommandProcessor(
    val key: String,
    val shortKey: String?,
    // TODO: Get the rest of the parameters setup.
// abstract get helpMessage(): string;
// abstract get exampleUsages(): string[];
// abstract get parameters(): CommandParameters;
) {
    abstract fun execute(command: Command): CommandProcessingResult
}
