package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.springframework.stereotype.Component
import xyz.deseteral.lebkuchenfm.domain.commands.CommandProcessor
import xyz.deseteral.lebkuchenfm.domain.commands.model.Command
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse
import xyz.deseteral.lebkuchenfm.domain.commands.model.SingleMessageResponse
import xyz.deseteral.lebkuchenfm.domain.x.SoundAlreadyExistsException
import xyz.deseteral.lebkuchenfm.domain.x.XSoundService

private val WRONG_MESSAGE_RESPONSE = SingleMessageResponse("Musisz podać nazwę i URL (`addx sound name|url`)")

@Component
class AddXCommandProcessor(private val xSoundService: XSoundService) : CommandProcessor {
    override val key: String
        get() = "addx"

    override val shortKey: String?
        get() = null

    override val helpMessage: String
        get() = "Dodaje efekt dźwiękowy (`addx sound name|url`)"

    override fun process(command: Command): CommandProcessingResponse {
        val args = command.getArgsByDelimiter("|")
        if (args.isEmpty() || args.size != 2) return WRONG_MESSAGE_RESPONSE

        val soundName = args[0].trim()
        val url = args[1].trim()

        if (soundName.isEmpty() || url.isEmpty()) return WRONG_MESSAGE_RESPONSE

        return try {
            xSoundService.addNewSound(soundName, url)
            SingleMessageResponse("Dodałem efekt \"$soundName\" do biblioteki!")
        } catch (ex: SoundAlreadyExistsException) {
            SingleMessageResponse("Dźwięk \"$soundName\" już istnieje. Wybierz inną nazwę, albo zastanów się co robisz.")
        }
    }
}
