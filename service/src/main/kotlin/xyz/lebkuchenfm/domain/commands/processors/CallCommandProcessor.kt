package xyz.lebkuchenfm.domain.commands.processors

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.ExecutionContext
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.radiopersonality.RadioPersonalityService

private val logger = KotlinLogging.logger {}

class CallCommandProcessor(
    private val eventStream: EventStream<*>,
    private val radioPersonalityService: RadioPersonalityService,
) : CommandProcessor(
    key = "call",
    shortKey = null,
    helpMessage = "Call with a message for radio personality.",
    exampleUsages = listOf("Hello! What is your favorite music genre?"),
    parameters = CommandParameters(
        parameters = listOf(
            CommandParameters.RequiredCommandParameter("message"),
        ),
    ),
) {
    override suspend fun execute(command: Command, context: ExecutionContext): CommandProcessingResult {
        val message = command.rawArgs

        if (message.isNullOrBlank()) {
            return error("You have to provide a message for the presenter!", logger)
        }

        val utterance = radioPersonalityService.onListenerCalling(message)
            ?: return error("Radio presenter could not provide a response for this message.", logger)

        eventStream.sendToEveryone(Event.Say.fromRadioPersonalityUtterance(utterance))

        return CommandProcessingResult.fromMarkdown("😎💬: ${utterance.text}")
    }
}
