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

class TagListCommandProcessor(private val xSoundsService: XSoundsService) :
    CommandProcessor(
        key = "tag-list",
        shortKey = null,
        helpMessage = "Lists sounds with the provided tag or lists all tags when none is provided",
        exampleUsages = listOf("", "example-tag"),
        parameters = CommandParameters(
            parameters = listOf(
                CommandParameters.OptionalCommandParameter("tag-name"),
            ),
        ),
    ) {
    override suspend fun execute(command: Command, context: ExecutionContext): CommandProcessingResult {
        val args = command.args
        if (args.isEmpty()) {
            return xSoundsService.listTags()
                .map { tags ->
                    return CommandProcessingResult.fromMultilineMarkdown(
                        "*There are ${tags.size} tags:*",
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
        val (tagName) = args

        return xSoundsService.listXSoundsWithTag(tagName)
            .map { soundList ->
                return CommandProcessingResult.fromMultilineMarkdown(
                    "*There are ${soundList.size} sounds tagged with $tagName: *",
                    *soundList.map { "- ${it.name}" }.toTypedArray(),
                )
            }
            .getOrElse { err ->
                error(
                    when (err) {
                        XSoundsService.ListWithTagError.UnknownError -> "Unknown error"
                    },
                    logger,
                )
            }
    }
}
