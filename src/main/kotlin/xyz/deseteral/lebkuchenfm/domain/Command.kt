package xyz.deseteral.lebkuchenfm.domain

data class Command(val key: String, val args: List<String>)

fun matchProcessor(command: Command, commandProcessor: CommandProcessor): Boolean {
    return command.key == commandProcessor.key || command.key == commandProcessor.shortKey
}

