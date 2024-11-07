package xyz.lebkuchenfm.domain.commands

import io.github.oshai.kotlinlogging.KotlinLogging

private val logger = KotlinLogging.logger {}

class CommandProcessorRegistry(processors: List<CommandProcessor>) {
    private val commands: Map<String, CommandProcessor>

    init {
        val mutableCommandsMap = mutableMapOf<String, CommandProcessor>()
        for (definition in processors) {
            mutableCommandsMap[definition.key] = definition
            definition.shortKey?.let { mutableCommandsMap[it] = definition }

            logger.info { "Initialized ${definition.key} command" }
        }
        commands = mutableCommandsMap.toMap()
    }

    fun getProcessorByKey(key: String): CommandProcessor? = commands[key]
    fun getCommandsKeys() = commands.keys
}
