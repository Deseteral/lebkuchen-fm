package xyz.lebkuchenfm.api.commands

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.commands.CommandExecutorService

private val logger = KotlinLogging.logger {}

fun Route.commandsRouting(commandExecutorService: CommandExecutorService) {
    route("/commands/text") {
        post {
            val text = call.receive<TextCommandRequest>().text
            logger.info { "Received $text command from TODO USERNAME" }

            val processingResult = commandExecutorService.processFromText(text)

            val response = TextCommandResponse(textResponse = processingResult.message.markdown)
            call.respond(response)
        }
    }
}

@Serializable
data class TextCommandRequest(val text: String)

@Serializable
data class TextCommandResponse(val textResponse: String)
