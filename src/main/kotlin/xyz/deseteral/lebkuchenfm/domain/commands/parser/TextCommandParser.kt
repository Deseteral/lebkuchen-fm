package xyz.deseteral.lebkuchenfm.domain.commands.parser

import xyz.deseteral.lebkuchenfm.domain.commands.model.Command

internal object TextCommandParser {
    fun parse(text: String): Command {
        if (text.isEmpty()) throw TextIsNotACommandException(text)

        val tokens = text.split(" ")
            .map { it.trim() }
            .filter { it.isNotEmpty() }

        val prompt = tokens.first()
        val key = tokens[1]

        if (tokens.isEmpty() || prompt != "/fm") {
            throw TextIsNotACommandException(text)
        }

        val rawArgsIndex = (text.indexOf(key) + (key.length) + 1)
        val rawArgs = try {
            text.substring(rawArgsIndex)
        } catch (ex: Exception) {
            ""
        }

        return Command(key, rawArgs)
    }
}
