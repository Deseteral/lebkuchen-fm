package xyz.deseteral.lebkuchenfm.domain.commands.model

import xyz.deseteral.lebkuchenfm.domain.commands.CommandProcessor

data class Command(val key: String, private val rawArgs: String) {
    fun getArgsByDelimiter(delimiter: String): List<String> {
        return rawArgs.split(delimiter).filter { it.isNotEmpty() }
    }
}

fun matchProcessor(command: Command, commandProcessor: CommandProcessor): Boolean {
    return command.key == commandProcessor.key || command.key == commandProcessor.shortKey
}
