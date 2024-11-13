package xyz.lebkuchenfm.domain.commands.processors

import com.github.michaelbull.result.getOrElse
import com.github.michaelbull.result.map
import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.ExecutionContext
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.xsounds.XSoundsService

private val logger = KotlinLogging.logger {}

class TagRemoveCommandProcessor(private val xSoundsService: XSoundsService) :
    CommandProcessor(
        key = "tag-remove",
        shortKey = null,
        helpMessage = "Removes a tag from the provided sound",
        exampleUsages = listOf("fun stuff|airhorn"),
        parameters = CommandParameters(
            parameters = listOf(
                CommandParameters.RequiredCommandParameter("tag-name"),
                CommandParameters.RequiredCommandParameter("sound-name"),
            ),
            delimiter = "|",
        ),
    ) {
    override suspend fun execute(command: Command, context: ExecutionContext): CommandProcessingResult {
        val args = command.args
        if (args.size != 2) {
            return error(
                """
                    You have to provide tag and sound names in the arguments.
                    Refer to this commands help message for usage info.
                """.trimIndent(),
                logger,
            )
        }
        val (tagName, soundName) = args

        return xSoundsService.removeTagFromXSound(soundName, tagName)
            .map { CommandProcessingResult.fromMarkdown("Removed $tagName from $soundName sound.") }
            .getOrElse { err ->
                error(
                    when (err) {
                        XSoundsService.RemoveTagError.SoundDoesNotExist -> "Sound $soundName doesn't exist."
                        XSoundsService.RemoveTagError.UnknownError -> "Couldn't remove $tagName from $soundName sound."
                    },
                    logger,
                )
            }
    }
}
