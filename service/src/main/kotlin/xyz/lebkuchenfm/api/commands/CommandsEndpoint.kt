package xyz.lebkuchenfm.api.commands

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.api.getUserSession
import xyz.lebkuchenfm.api.respondWithProblem
import xyz.lebkuchenfm.domain.commands.CommandExecutorService
import xyz.lebkuchenfm.domain.commands.ExecutionContext

private val logger = KotlinLogging.logger {}

fun Route.commandsRouting(commandExecutorService: CommandExecutorService) {
    post("/commands/execute") {
        val session = call.getUserSession()
        val context = ExecutionContext(session)

        val processingResult = when (call.request.headers["Content-Type"]) {
            "plain/text" -> {
                val text = call.receive<TextCommandRequest>().text
                logger.info { "Received $text command from ${session.name}" }
                commandExecutorService.executeFromText(text, context)
            }
            else -> {
                call.respondWithProblem(
                    title = "Invalid content type.",
                    detail = "Unsupported content type.",
                    status = HttpStatusCode.UnsupportedMediaType,
                )
                return@post
            }
        }

        val response = TextCommandResponse(textResponse = processingResult.message.markdown)
        call.respond(response)
    }
}

@Serializable
data class TextCommandRequest(val text: String)

@Serializable
data class TextCommandResponse(val textResponse: String)
