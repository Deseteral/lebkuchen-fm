package xyz.deseteral.lebkuchenfm.domain

import java.util.Collections

internal class Command(val key: String, args: List<String>) {
    private val args: List<String>

    init {
        this.args = List.copyOf<String>(args)
    }

    fun getArgs(): List<String> {
        return Collections.unmodifiableList(args)
    }

    fun matchProcessor(commandProcessor: CommandProcessor): Boolean {
        val keyMatch = commandProcessor.key == this.key
        val shortKeyMatch = commandProcessor.shortKey
                .map { shortKey -> shortKey == this.key }
                .orElse(false)

        return keyMatch || shortKeyMatch
    }
}
