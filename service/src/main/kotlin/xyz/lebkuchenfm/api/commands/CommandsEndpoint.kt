package xyz.lebkuchenfm.api.commands

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.auth.UserSession
import xyz.lebkuchenfm.domain.commands.CommandExecutorService
import xyz.lebkuchenfm.domain.commands.ExecutionContext

private val logger = KotlinLogging.logger {}

fun Route.commandsRouting(commandExecutorService: CommandExecutorService) {
    post("/commands/text") {
        // TODO: Get UserSession from request when the endpoints get authorization.
        val session = UserSession("FAKE USER TODO")
        // val session = call.sessions.get<UserSession>()
        // checkNotNull(session)

        val text = call.receive<TextCommandRequest>().text
        logger.info { "Received $text command from ${session.name}" }

        val context = ExecutionContext(session)
        val processingResult = commandExecutorService.executeFromText(text, context)

        val response = TextCommandResponse(textResponse = processingResult.message.markdown)
        call.respond(response)
    }
}

@Serializable
data class TextCommandRequest(val text: String)

@Serializable
data class TextCommandResponse(val textResponse: String)
