package xyz.lebkuchenfm.domain.commands.processors

import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.eventstream.PlayXSoundEvent
import xyz.lebkuchenfm.domain.xsounds.XSoundsService

class XCommandProcessor(private val xSoundsService: XSoundsService, private val eventStream: EventStream) :
    CommandProcessor(
        key = "x",
        shortKey = null,
        helpMessage = "Puszcza szalony dźwięk!",
        exampleUsages = listOf("airhorn"),
        parameters = CommandParameters(
            parameters = listOf(
                CommandParameters.RequiredCommandParameter("sound-name"),
            ),
        ),
    ) {
    override fun execute(command: Command): CommandProcessingResult {
        // TODO: Error handling for null case. ?: throw new Error ('Podaj nazwę dźwięku');
        val soundName = command.rawArgs!!
        val xSound = xSoundsService.getByName(soundName)

        val playXSoundEvent = PlayXSoundEvent(
            soundUrl = xSound.url,
        )

        eventStream.sendToEveryone(playXSoundEvent)
        xSoundsService.incrementPlayCount(xSound.name)

        return CommandProcessingResult.fromMarkdown("Played $soundName sound.") // TODO: i18n.
    }
}
