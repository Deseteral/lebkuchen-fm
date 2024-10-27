package xyz.lebkuchenfm.domain.commands

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.LebkuchenException
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult

private val logger = KotlinLogging.logger {}

class CommandExecutorService(
    private val parser: TextCommandParser,
    private val registry: CommandProcessorRegistry,
) {
    private fun execute(command: Command): CommandProcessingResult {
        val processor =
            try {
                registry.getProcessorByKey(command.key)
            } catch (ex: CommandDoesNotExistException) {
                return ex.toCommandProcessingResult()
            }

        return try {
            processor.execute(command)
        } catch (ex: LebkuchenException) {
            logger.error(ex) { "There was a problem when executing $command." }
            return ex.toCommandProcessingResult()
        }
    }

    fun executeFromText(text: String): CommandProcessingResult {
        val command =
            try {
                parser.parseFromText(text)
            } catch (ex: LebkuchenException) {
                logger.error(ex) { "Could not parse command \"$text\"." }
                return ex.toCommandProcessingResult()
            }

        return execute(command)
    }
}
