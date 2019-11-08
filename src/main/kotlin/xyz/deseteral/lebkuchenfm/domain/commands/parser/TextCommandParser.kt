package xyz.deseteral.lebkuchenfm.domain.commands.parser

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import xyz.deseteral.lebkuchenfm.domain.commands.model.Command

@Component
class TextCommandParser(@Value("\${COMMAND_PROMPT:/fm}") val commandPrompt: String) {
    fun parse(text: String): Command {
        val tokens = text.split(" ")
            .map { it.trim() }
            .filter { it.isNotEmpty() }

        if (tokens.size < 2) throw TextIsNotACommandException(text)

        val prompt = tokens.first()
        val key = tokens[1]

        if (prompt != commandPrompt) throw TextIsNotACommandException(text)

        val rawArgsIndex = (text.indexOf(key) + (key.length) + 1)
        val rawArgs = try {
            text.substring(rawArgsIndex)
        } catch (ex: Exception) {
            ""
        }

        return Command(key, rawArgs)
    }
}
