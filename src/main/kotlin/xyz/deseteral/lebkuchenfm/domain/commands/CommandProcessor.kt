package xyz.deseteral.lebkuchenfm.domain.commands

import xyz.deseteral.lebkuchenfm.domain.commands.model.Command
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse

interface CommandProcessor {
    val key: String
    val shortKey: String?
    val helpMessage: String

    fun process(command: Command): CommandProcessingResponse
}
