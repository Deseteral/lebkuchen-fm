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
        helpMessage = "Lists sounds with a selected tag",
        exampleUsages = listOf("fun stuff"),
        parameters = CommandParameters(
            parameters = listOf(
                CommandParameters.RequiredCommandParameter("tag-name"),
            ),
        ),
    ) {
    override suspend fun execute(command: Command, context: ExecutionContext): CommandProcessingResult {
        val args = command.args
        if (args.size != 1) {
            return error(
                """
                    You have to provide tag name as an argument.
                    Refer to this command's help message for usage info.
                """.trimIndent(),
                logger,
            )
        }
        val (tagName) = args

        return xSoundsService.listXSoundsFromTag(tagName)
            .map { soundList ->
                CommandProcessingResult.fromMarkdown("There are ${soundList.size} sounds tagged with $tagName: ${soundList.joinToString(", ") { it.name }}")
            }
            .getOrElse { err ->
                error(
                    when (err) {
                        XSoundsService.ListTagError.UnknownError -> "Unknown error"
                    },
                    logger,
                )
            }
    }
}
