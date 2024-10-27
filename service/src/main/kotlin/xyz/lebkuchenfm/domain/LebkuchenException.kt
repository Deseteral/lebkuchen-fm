package xyz.lebkuchenfm.domain

import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult

abstract class LebkuchenException(message: String, val userMessage: String) : Exception(message) {
    fun toCommandProcessingResult() = CommandProcessingResult.fromMarkdown(userMessage)
}
