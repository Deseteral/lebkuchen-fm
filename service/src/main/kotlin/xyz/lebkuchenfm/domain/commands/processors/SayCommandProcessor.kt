package xyz.lebkuchenfm.domain.commands.processors

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.ExecutionContext
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.radiopersonality.speechsynthesis.TextToSpeechProvider

private val logger = KotlinLogging.logger {}

class SayCommandProcessor(
    private val eventStream: EventStream<*>,
    private val textToSpeechProvider: TextToSpeechProvider,
) : CommandProcessor(
    key = "say",
    shortKey = null,
    helpMessage = "Say something using radio personality voice.",
    exampleUsages = listOf("Hello, world!"),
    parameters = CommandParameters(
        parameters = listOf(
            CommandParameters.RequiredCommandParameter("message"),
        ),
    ),
) {

    override suspend fun execute(command: Command, context: ExecutionContext): CommandProcessingResult {
        val message = command.rawArgs

        if (message.isNullOrBlank()) {
            return error("You have to provide a message to speak!", logger)
        }

        val audio = textToSpeechProvider.synthesize(message)
            ?: return error("Could not synthesize audio.", logger)

        eventStream.sendToEveryone(Event.Say(message, audio))
        return CommandProcessingResult.fromMarkdown("😎💬: $message")
    }
}
