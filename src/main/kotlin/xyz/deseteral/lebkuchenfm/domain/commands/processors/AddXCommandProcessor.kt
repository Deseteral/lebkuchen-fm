package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.springframework.stereotype.Component
import xyz.deseteral.lebkuchenfm.domain.commands.CommandProcessor
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse
import xyz.deseteral.lebkuchenfm.domain.x.XSoundService

@Component
class AddXCommandProcessor(private val xSoundService: XSoundService) : CommandProcessor {
    override val key: String
        get() = "addx"

    override val shortKey: String?
        get() = null

    override val helpMessage: String
        get() = "Dodaje efekt dźwiękowy (`addx sound name|url`)"

    override fun process(args: List<String>): CommandProcessingResponse {
        if (args.isEmpty()) return CommandProcessingResponse("Musisz podać nazwę i URL (`addx sound name|url`)")

        val addxArgs = args[0].split('|').map { it.trim() }.filter { it.isNotEmpty() }
        if (addxArgs.size != 2) return CommandProcessingResponse("Musisz podać nazwę i URL (`addx sound name|url`)")

        val (soundName, url) = addxArgs
        xSoundService.addNewSound(soundName, url)
        return CommandProcessingResponse("Dodałem efekt \"$soundName\" do biblioteki!")
    }
}
