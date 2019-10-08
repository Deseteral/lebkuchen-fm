package xyz.deseteral.lebkuchenfm.domain

class NoSuchCommandProcessorException(command: Command) : RuntimeException(String.format("Command '%s' does not exist", command.key))
