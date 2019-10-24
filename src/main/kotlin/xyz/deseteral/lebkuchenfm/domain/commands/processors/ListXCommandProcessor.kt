package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.springframework.stereotype.Component
import xyz.deseteral.lebkuchenfm.domain.commands.CommandProcessor
import xyz.deseteral.lebkuchenfm.domain.commands.model.*
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
        val messages = xSoundService.getAllXSounds().map { Message(it.name, MessageType.PLAIN) }

        return MultiMessageResponse(messages)
    }
}
