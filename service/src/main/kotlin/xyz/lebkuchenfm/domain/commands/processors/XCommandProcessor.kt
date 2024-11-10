package xyz.lebkuchenfm.domain.commands.processors

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.ExecutionContext
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.xsounds.XSoundsService

private val logger = KotlinLogging.logger {}

class XCommandProcessor(private val xSoundsService: XSoundsService, private val eventStream: EventStream) :
    CommandProcessor(
        key = "x",
        shortKey = null,
        helpMessage = "Plays a crazy sound!",
        exampleUsages = listOf("airhorn"),
        parameters = CommandParameters(
            parameters = listOf(
                CommandParameters.RequiredCommandParameter("sound-name"),
            ),
        ),
    ) {
    override suspend fun execute(command: Command, context: ExecutionContext): CommandProcessingResult {
        val soundName = command.rawArgs
            ?: return error("You have to provide sound name.", logger)

        val xSound = xSoundsService.getByName(soundName)
            ?: return error("Sound '$soundName' does not exist.", logger)

        eventStream.sendToEveryone(Event.PlayXSound(soundUrl = xSound.url))
        xSoundsService.markAsPlayed(xSound.name)

        return CommandProcessingResult.fromMarkdown("Played $soundName sound.")
    }
}
