package xyz.lebkuchenfm.domain.commands

import xyz.lebkuchenfm.domain.LebkuchenException
import xyz.lebkuchenfm.domain.commands.model.Command

class TextCommandParser(private val commandPrompt: String) {
    fun parseFromText(text: String): Command {
        val tokens = text
            .split(' ')
            .map { it.trim() }
            .filter { it.isNotEmpty() }

        val prompt = tokens.first()
        if (prompt != commandPrompt) throw UnparsableCommandException.badPrompt(commandPrompt, prompt)
        if (tokens.size < 2) throw UnparsableCommandException.missingRequiredComponents(commandPrompt)

        val (_, key) = tokens
        val rawArgs = text
            .substringAfter(key, "")
            .trim()
            .ifBlank { null }

        return Command(key, rawArgs)
    }
}

class UnparsableCommandException(message: String, userMessage: String) : LebkuchenException(message, userMessage) {
    // TODO: i18n.
    companion object {
        fun missingRequiredComponents(prompt: String) = UnparsableCommandException(
            "Text must contain prompt and command key to be a valid command.",
            "Twoja komenda musi wykonywać jakąś akcję. Sprawdź `$prompt help` aby dowiedzieć się więcej.",
        )

        fun badPrompt(expectedPrompt: String, receivedPrompt: String) = UnparsableCommandException(
            "First token must be the command prompt. Expected $expectedPrompt, got $receivedPrompt.",
            "Musisz użyć `$expectedPrompt`, aby wykonać komendę.",
        )
    }
}
