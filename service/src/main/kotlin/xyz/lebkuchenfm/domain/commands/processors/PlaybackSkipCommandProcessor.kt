package xyz.lebkuchenfm.domain.commands.processors

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.ExecutionContext
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream

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
        return when (val argument = Skip.fromString(command.args.firstOrNull())) {
            is Skip.All -> successfulResult.also { sendEvent(all = true) }
            is Skip.Some -> successfulResult.also { sendEvent(amount = argument.amount) }
            is Skip.None -> errorResult
        }
    }

    private val successfulResult: CommandProcessingResult by lazy {
        CommandProcessingResult.fromMarkdown("Moving forward")
    }
    private val errorResult: CommandProcessingResult by lazy {
        error("Commands accepts only natural numbers or \"all\" string as an argument.", logger)
    }

    private suspend fun sendEvent(all: Boolean = false, amount: Int = 1) {
        eventStream.sendToEveryone(Event.Skip(all, amount))
    }

    sealed class Skip {
        data object All : Skip()
        data object None : Skip()
        class Some(val amount: Int) : Skip()

        companion object {
            fun fromString(value: String?): Skip {
                return when (value) {
                    null -> Some(1)
                    "all" -> All
                    else -> value.toIntOrNull()
                        ?.takeIf { it > 1 }
                        ?.let { Some(it) }
                        ?: None
                }
            }
        }
    }
}
