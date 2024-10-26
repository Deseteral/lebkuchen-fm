package xyz.lebkuchenfm.domain.commands

data class CommandProcessingResult(
    val message: CommandProcessingResultMessage,
) {
    data class CommandProcessingResultMessage(
        val markdown: String,
    )
}
