package xyz.lebkuchenfm.domain.commands

import io.github.oshai.kotlinlogging.KotlinLogging

private val logger = KotlinLogging.logger {}

class CommandExecutorService {
    fun processFromText(text: String): CommandProcessingResult {
        logger.debug { "Processing $text command" }
        return CommandProcessingResult(message = CommandProcessingResult.CommandProcessingResultMessage("Bang"))
    }
}
