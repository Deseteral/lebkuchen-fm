package xyz.lebkuchenfm.domain.commands.model

data class CommandProcessingResult(
    val message: CommandProcessingResultMessage,
) {
    data class CommandProcessingResultMessage(
        val markdown: String,
    )

    companion object {
        fun fromMarkdown(markdown: String): CommandProcessingResult {
            return CommandProcessingResult(message = CommandProcessingResultMessage(markdown))
        }

        fun fromMultilineMarkdown(vararg markdownLines: String): CommandProcessingResult {
            return fromMarkdown(markdownLines.joinToString(separator = "\n"))
        }
    }
}
