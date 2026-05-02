package xyz.lebkuchenfm.domain.commands.model

sealed class CommandProcessingResult {
    abstract val markdown: String

    data class Success(override val markdown: String) : CommandProcessingResult() {
        companion object {
            fun fromMultilineMarkdown(vararg markdownLines: String): Success =
                Success(markdownLines.joinToString(separator = "\n"))
        }
    }

    data class Error(override val markdown: String) : CommandProcessingResult() {
        companion object {
            fun fromMultilineMarkdown(vararg markdownLines: String): Error =
                Error(markdownLines.joinToString(separator = "\n"))
        }
    }

    data class InsufficientPermissions(override val markdown: String) : CommandProcessingResult()
}
