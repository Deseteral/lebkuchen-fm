package xyz.lebkuchenfm.domain.commands.processors

import com.github.michaelbull.result.getOrElse
import com.github.michaelbull.result.map
import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.ExecutionContext
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.soundboard.SoundboardService
import xyz.lebkuchenfm.domain.soundboard.SoundboardService.PlayXSoundError

private val logger = KotlinLogging.logger {}

class XCommandProcessor(private val soundboardService: SoundboardService) :
    CommandProcessor(
        key = "x",
        shortKey = null,
        helpMessage = "Plays a crazy sound!",
        exampleUsages = listOf("airhorn"),
        parameters = CommandParameters(
            parameters = listOf(
                CommandParameters.RequiredCommandParameter("sound-name"),
            ),
        ),
    ) {
    override suspend fun execute(command: Command, context: ExecutionContext): CommandProcessingResult {
        val soundName = command.rawArgs
            ?: return error("You have to provide sound name.", logger)

        return soundboardService.playXSound(soundName)
            .map { CommandProcessingResult.fromMarkdown("Played $soundName sound.") }
            .getOrElse { error ->
                val message = when (error) {
                    PlayXSoundError.SoundNotFound -> "Sound '$soundName' does not exist."
                }
                error(message, logger)
            }
    }
}
