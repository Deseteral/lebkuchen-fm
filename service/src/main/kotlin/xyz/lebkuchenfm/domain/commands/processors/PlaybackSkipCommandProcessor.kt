package xyz.lebkuchenfm.domain.commands.processors

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.ExecutionContext
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.eventstream.SkipAmount

private val logger = KotlinLogging.logger {}

class PlaybackSkipCommandProcessor(private val eventStream: EventStream<*>) :
    CommandProcessor(
        key = "playback-skip",
        shortKey = "skip",
        helpMessage = "Skips currently playing song. May also remove additional ones from queue.",
        exampleUsages = listOf("", "1", "2", "all"),
        parameters = CommandParameters(
            parameters = listOf(
                CommandParameters.OptionalCommandParameter("amount"),
            ),
        ),
    ) {

    override suspend fun execute(command: Command, context: ExecutionContext): CommandProcessingResult {
        val amountValue = command.args.firstOrNull()
        val amount = SkipAmount.fromString(amountValue)
        return amount?.let {
            successfulResult.also { sendEvent(amount) }
        } ?: errorResult
    }

    private val successfulResult: CommandProcessingResult by lazy {
        CommandProcessingResult.fromMarkdown("Moving forward")
    }
    private val errorResult: CommandProcessingResult by lazy {
        error("Commands accepts only natural numbers or \"all\" string as an argument.", logger)
    }

    private suspend fun sendEvent(amount: SkipAmount) {
        eventStream.sendToEveryone(Event.Skip(amount))
    }
}
