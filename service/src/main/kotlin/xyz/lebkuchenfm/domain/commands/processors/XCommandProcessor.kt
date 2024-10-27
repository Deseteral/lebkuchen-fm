package xyz.lebkuchenfm.domain.commands.processors

import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult

class XCommandProcessor : CommandProcessor(
    key = "x",
    shortKey = null,
    helpMessage = "Puszcza szalony dźwięk!",
    exampleUsages = listOf("airhorn"),
    parameters =
        CommandParameters(
            parameters =
                listOf(
                    CommandParameters.RequiredCommandParameter("sound-name"),
                ),
        ),
) {
    override fun execute(command: Command): CommandProcessingResult {
        TODO("Not yet implemented")
    }
}
