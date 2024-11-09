package xyz.lebkuchenfm.domain.commands.processors

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.xsounds.XSoundsService

private val logger = KotlinLogging.logger {}

class TagAddCommandProcessor(private val xSoundsService: XSoundsService) :
    CommandProcessor(
        key = "tag-add",
        shortKey = null,
        helpMessage = "Adds a tag to the provided sound",
        exampleUsages = listOf("fun stuff|airhorn"),
        parameters = CommandParameters(
            parameters = listOf(
                CommandParameters.RequiredCommandParameter("tag-name"),
                CommandParameters.RequiredCommandParameter("sound-name"),
            ),
            delimiter = "|",
        ),
    ) {
    override suspend fun execute(command: Command): CommandProcessingResult {
        val args = command.getArgsByDelimiter(this.parameters.delimiter)
        if (args.size != 2) {
            return error("You have to provide tag-name|sound-name in the arguments", logger)
        }
        val (tagName, soundName) = args

        xSoundsService.addTagToXSound(soundName, tagName)
            ?: return error("Sound $soundName doesn't exist", logger)

        return CommandProcessingResult.fromMarkdown("Added '$tagName' tag to '$soundName' sound.")
    }
}
