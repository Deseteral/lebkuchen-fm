package xyz.deseteral.lebkuchenfm.domain

import java.util.Arrays
import java.util.Optional
import java.util.stream.Collectors

internal object CommandParser {
    fun parse(text: String): Optional<Command> {
        val parsableText = Optional.ofNullable(text).orElse("")
        val tokens = Arrays
                .stream(parsableText.split(" ".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray())
                .map<String>(Function<String, String> { it.trim({ it <= ' ' }) })
                .filter { s -> !s.isEmpty() }
                .collect<List<String>, Any>(Collectors.toList())

        if (tokens.isEmpty() || tokens[0] != "/fm") {
            return Optional.empty()
        }

        val key = tokens[1]
        val args = tokens.subList(2, tokens.size)

        return Optional.of(Command(key, args))
    }
}
