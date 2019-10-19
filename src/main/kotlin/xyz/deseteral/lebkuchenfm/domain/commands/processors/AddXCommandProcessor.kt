package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.springframework.stereotype.Component
import xyz.deseteral.lebkuchenfm.domain.commands.CommandProcessor
import xyz.deseteral.lebkuchenfm.domain.commands.model.Command
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse
import xyz.deseteral.lebkuchenfm.domain.x.SoundAlreadyExistsException
import xyz.deseteral.lebkuchenfm.domain.x.XSoundService

private const val MESSAGE_WRONG_ARGS = "Musisz podać nazwę i URL (`addx sound name|url`)"

@Component
class AddXCommandProcessor(private val xSoundService: XSoundService) : CommandProcessor {
    override val key: String
        get() = "addx"

    override val shortKey: String?
        get() = null

    override val helpMessage: String
        get() = "Dodaje efekt dźwiękowy (`addx sound name|url`)"

    override fun process(command: Command): CommandProcessingResponse {
        if (command.args.isEmpty()) return CommandProcessingResponse(MESSAGE_WRONG_ARGS)

        val addxArgs = command.args[0].split('|').map { it.trim() }.filter { it.isNotEmpty() }
        if (addxArgs.size != 2) return CommandProcessingResponse(MESSAGE_WRONG_ARGS)

        val (soundName, url) = addxArgs
        try {
            xSoundService.addNewSound(soundName, url)
        } catch (ex: SoundAlreadyExistsException) {
            return CommandProcessingResponse("Dźwięk \"$soundName\" już istnieje. Wybierz inną nazwę, albo zastanów się co robisz.")
        }

        return CommandProcessingResponse("Dodałem efekt \"$soundName\" do biblioteki!")
    }
}
