package xyz.deseteral.lebkuchenfm.domain.commands.model

import xyz.deseteral.lebkuchenfm.domain.commands.CommandProcessor

data class Command(val key: String, val args: List<String>, val rawArgs: String)

fun matchProcessor(command: Command, commandProcessor: CommandProcessor): Boolean {
    return command.key == commandProcessor.key || command.key == commandProcessor.shortKey
}
