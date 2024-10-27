package xyz.lebkuchenfm.domain.commands.processors

import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult

class XCommandProcessor : CommandProcessor(key = "x", shortKey = null) {
    override fun execute(command: Command): CommandProcessingResult {
        TODO("Not yet implemented")
    }
}
