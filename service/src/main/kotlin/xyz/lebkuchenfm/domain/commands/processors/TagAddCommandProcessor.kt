package xyz.lebkuchenfm.domain.commands.processors

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.xsounds.XSoundsService

private val logger = KotlinLogging.logger {}

class TagAddCommandProcessor(private val xSoundsService: XSoundsService, private val eventStream: EventStream) :
    CommandProcessor(
        key = "tag-add",
        shortKey = null,
        helpMessage = "Adds a tag to the provided sound",
        exampleUsages = listOf("fun stuff", "airhorn"),
        parameters = CommandParameters(
            parameters = listOf(
                CommandParameters.RequiredCommandParameter("tag-name"),
                CommandParameters.RequiredCommandParameter("sound-name"),
            ),
        ),
    ) {
    override suspend fun execute(command: Command): CommandProcessingResult {
        val args = command.rawArgs?.split('|')
        if (args == null || args.size != 2) {
            return error("You have to provide tag-name|sound-name in the arguments", logger)
        }
        val (tagName, soundName) = args

        return CommandProcessingResult.fromMarkdown("Added '$tagName' tag to  '$soundName' sound.")
    }
}
