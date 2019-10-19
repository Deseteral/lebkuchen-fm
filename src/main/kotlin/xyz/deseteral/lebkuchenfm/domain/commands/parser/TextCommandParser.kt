package xyz.deseteral.lebkuchenfm.domain.commands.parser

import xyz.deseteral.lebkuchenfm.domain.commands.model.Command

internal object TextCommandParser {
    fun parse(text: String): Command {
        val tokens = text.split(" ")
            .map { it.trim() }
            .filter { it.isNotEmpty() }

        if (tokens.isEmpty() || tokens.first() != "/fm") {
            throw TextIsNotACommandException(text)
        }

        val args = tokens.subList(2, tokens.size)
        return Command(
            key = tokens[1],
            args = args,
            rawArgs = args.joinToString(" ")
        )
    }
}
