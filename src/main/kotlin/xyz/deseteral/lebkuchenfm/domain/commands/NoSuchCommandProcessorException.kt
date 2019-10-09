package xyz.deseteral.lebkuchenfm.domain.commands

import xyz.deseteral.lebkuchenfm.domain.commands.model.Command

class NoSuchCommandProcessorException(command: Command)
    : RuntimeException(String.format("Command '%s' does not exist", command.key))
