package xyz.lebkuchenfm.domain.commands.processors

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.eventstream.AddSongsToQueueEvent
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.songs.Song
import xyz.lebkuchenfm.domain.songs.SongsService

private val logger = KotlinLogging.logger {}

class SongRandomCommandProcessor(private val songsService: SongsService, private val eventStream: EventStream) :
    CommandProcessor(
        key = "song-random",
        shortKey = "random",
        helpMessage = "todo",
        exampleUsages = listOf("", "3", "britney", "3 britney"),
        parameters = CommandParameters(
            parameters = listOf(
                CommandParameters.OptionalMultiValue("quantity", "phrase"),
            ),
        ),
    ) {
    override suspend fun execute(command: Command): CommandProcessingResult {
        // TODO: handle parameters
        val requestedAmount = listOf(1, 2).random()
        val phrase: String? = null

        val songs = songsService.getRandomAvailableSongs(1, phrase)

        if (songs.isEmpty()) {
            logger.error { "Song not found!" }
            return CommandProcessingResult.fromMarkdown("Something went wrong!")
        }

        // TODO: increment play count

        eventStream.sendToEveryone(AddSongsToQueueEvent(songs))
        val messageLines = buildMessage(songs, requestedAmount)
        return CommandProcessingResult.fromMultilineMarkdown(*messageLines.toTypedArray())
    }

    private fun buildMessage(songsToQueue: List<Song>, requestedAmount: Int): List<String> {
        val queuedCount = songsToQueue.count()
        val requestAmountMessage = if (queuedCount == requestedAmount) "" else " from $requestedAmount requested"

        return listOfNotNull(
            "Queued $queuedCount$requestAmountMessage:",
            *songsToQueue.take(MAX_TITLES_IN_MESSAGE).map { "- _${it.name}_" }.toTypedArray(),
            "...and others.".takeIf { queuedCount > requestedAmount },
        )
    }

    companion object {
        const val MAX_TITLES_IN_MESSAGE = 10
    }
}
