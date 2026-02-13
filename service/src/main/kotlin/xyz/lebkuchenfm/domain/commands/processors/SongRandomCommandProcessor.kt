package xyz.lebkuchenfm.domain.commands.processors

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.ExecutionContext
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.commands.processors.SongQueueCommandProcessor.Companion.buildMessage
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.songs.SongsService

private val logger = KotlinLogging.logger {}

class SongRandomCommandProcessor(private val songsService: SongsService, private val eventStream: EventStream<*>) :
    CommandProcessor(
        key = "song-random",
        shortKey = "random",
        helpMessage = "Queue random songs from the history. May return less songs than requested.",
        exampleUsages = listOf("", "3", "britney", "3 britney"),
        parameters = CommandParameters(
            parameters = listOf(
                CommandParameters.OptionalMultiValue("amount", "phrase"),
            ),
            delimiter = " ",
        ),
    ) {
    override suspend fun execute(command: Command, context: ExecutionContext): CommandProcessingResult {
        val (amount, phrase) = getAmountAndKeywordsFromArgs(command.args)

        if (amount < 1 || amount > MAX_SONGS_IN_YOUTUBE_REQUEST) {
            return error("This command supports between 1 and $MAX_SONGS_IN_YOUTUBE_REQUEST songs.", logger)
        }

        val songs = songsService.getRandomSongs(amount, phrase)

        if (songs.isEmpty()) {
            return error("Could not queue any song.", logger)
        }

        val songsWithVideoStream = songs.mapNotNull { songsService.enrichSongWithVideoStreamUrl(it) }

        eventStream.sendToEveryone(Event.QueueSongs(songsWithVideoStream))

        songs.forEach { songsService.incrementPlayCount(it, context.session) }

        val messageLines = buildMessage(songs, amount)
        return CommandProcessingResult.fromMultilineMarkdown(*messageLines.toTypedArray())
    }

    private fun getAmountAndKeywordsFromArgs(args: List<String>): Pair<Int, String> {
        val amount: Int? = args.firstOrNull()?.toIntOrNull()
        val skip = if (amount != null) 1 else 0
        val phrase = args.drop(skip).joinToString(" ")
        return (amount ?: 1) to phrase
    }

    companion object {
        const val MAX_SONGS_IN_YOUTUBE_REQUEST = 50
    }
}
