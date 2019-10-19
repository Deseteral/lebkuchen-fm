package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.springframework.stereotype.Component
import xyz.deseteral.lebkuchenfm.domain.commands.CommandProcessor
import xyz.deseteral.lebkuchenfm.domain.commands.model.Command
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse
import xyz.deseteral.lebkuchenfm.domain.x.XSoundService

@Component
class ListXCommandProcessor(private val xSoundService: XSoundService) : CommandProcessor {
    override val key: String
        get() = "listx"

    override val shortKey: String?
        get() = null

    override val helpMessage: String
        get() = "Wypisuje listę czaderskich dźwięków w bazie"

    override fun process(command: Command): CommandProcessingResponse {
        val response = xSoundService.getAllXSounds().joinToString("\n") { "- ${it.name}" }
        return CommandProcessingResponse(response)
    }
}
