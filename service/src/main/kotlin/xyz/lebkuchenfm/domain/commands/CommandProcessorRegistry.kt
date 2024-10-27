package xyz.lebkuchenfm.domain.commands

import io.github.oshai.kotlinlogging.KotlinLogging

private val logger = KotlinLogging.logger {}

class CommandProcessorRegistry(processors: List<CommandProcessor>) {
    private val commands: Map<String, CommandProcessor>

    init {
        val mutableCommandsMap = mutableMapOf<String, CommandProcessor>()
        for (definition in processors) {
            mutableCommandsMap[definition.key] = definition

            if (definition.shortKey != null) {
                mutableCommandsMap[definition.shortKey] = definition
            }

            logger.info { "Initialized ${definition.key} command" }
        }
        commands = mutableCommandsMap.toMap()
    }

    fun getProcessorByKey(key: String): CommandProcessor? {
        // TODO: Should this method throw instead of returning null?
        return commands[key]
    }
}
