package xyz.lebkuchenfm.domain.commands.processors

import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.ExecutionContext
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream

class PlaybackPauseCommandProcessor(private val eventStream: EventStream<*>) :
    CommandProcessor(
        key = "playback-pause",
        shortKey = "pause",
        helpMessage = "Pause currently playing video.",
        exampleUsages = listOf(""),
        parameters = CommandParameters(
            parameters = emptyList(),
        ),
    ) {

    override suspend fun execute(command: Command, context: ExecutionContext): CommandProcessingResult {
        eventStream.sendToEveryone(Event.Resume)
        return CommandProcessingResult.fromMarkdown("⏸")
    }
}
