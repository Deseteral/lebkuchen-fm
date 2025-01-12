package xyz.lebkuchenfm.api.commands

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.request.uri
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.api.ProblemResponse
import xyz.lebkuchenfm.api.getUserSession
import xyz.lebkuchenfm.api.toDto
import xyz.lebkuchenfm.domain.commands.CommandExecutorService
import xyz.lebkuchenfm.domain.commands.ExecutionContext

private val logger = KotlinLogging.logger {}

fun Route.commandsRouting(commandExecutorService: CommandExecutorService) {
    post("/commands") {
        val contentType = call.request.headers["Content-Type"]

        if (contentType != "plain/text") {
            val status = HttpStatusCode.UnsupportedMediaType
            val problem = ProblemResponse(
                title = "Invalid content type.",
                detail = "Unsupported content type.",
                status = status,
                instance = call.request.uri,
            )
            call.respond(status, problem.toDto())
            return@post
        }

        val session = call.getUserSession()

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
