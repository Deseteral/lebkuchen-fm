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

class TagShowCommandProcessor(private val xSoundsService: XSoundsService) :
    CommandProcessor(
        key = "tag-show",
        shortKey = null,
        helpMessage = "Lists tags assigned the provided sound",
        exampleUsages = listOf("example-sound"),
        parameters = CommandParameters(
            parameters = listOf(
                CommandParameters.RequiredCommandParameter("sound-name")
            ),
        ),
    ) {
    override suspend fun execute(command: Command, context: ExecutionContext): CommandProcessingResult {
        val args = command.args
        if (args.size != 1) {
            return error(
                """
                You have to provide a sound name in the arguments.
                Refer to this command's help message for usage info.
            """.trimIndent(),
                logger,
            )
        }
        val (soundName) = args

        return xSoundsService.listTags()
            .map { tags ->
                return CommandProcessingResult.fromMultilineMarkdown(
                    "*Sound $soundName has ${tags.size} tags:*",
                    *tags.map { "- $it" }.toTypedArray(),
                )
            }
            .getOrElse { err ->
                error(
                    when (err) {
                        XSoundsService.ListTagsError.UnknownError -> "Unknown error"
                    },
                    logger,
                )
            }
    }
}
