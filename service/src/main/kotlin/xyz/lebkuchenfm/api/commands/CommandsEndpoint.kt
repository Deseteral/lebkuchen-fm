package xyz.lebkuchenfm.api.commands

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.contentType
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.api.getUserSession
import xyz.lebkuchenfm.api.missesScopes
import xyz.lebkuchenfm.api.respondWithProblem
import xyz.lebkuchenfm.domain.auth.Scope
import xyz.lebkuchenfm.domain.commands.CommandExecutorService
import xyz.lebkuchenfm.domain.commands.ExecutionContext

private val logger = KotlinLogging.logger {}

fun Route.commandsRouting(commandExecutorService: CommandExecutorService) {
    post("/commands/execute") {
        if (call.missesScopes(Scope.COMMANDS_EXECUTE)) {
            return@post
        }
        val contentType = call.request.contentType()
        val session = call.getUserSession()
        val context = ExecutionContext(session)

        val processingResult = when {
            contentType.match(ContentType.Text.Plain) -> {
                val text = call.receive<String>()
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
data class TextCommandResponse(val textResponse: String)
