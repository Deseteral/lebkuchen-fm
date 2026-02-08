package xyz.lebkuchenfm.domain.commands.processors

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.auth.Scope
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.ExecutionContext
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.songs.Song
import xyz.lebkuchenfm.domain.songs.SongsService

private val logger = KotlinLogging.logger {}

class SongQueueCommandProcessor(private val songsService: SongsService, private val eventStream: EventStream<*>) :
    CommandProcessor(
        key = "song-queue",
        shortKey = "q",
        helpMessage = """
            Adds a song from the database to the queue, and if it is not there,
            treats the phrase as a YouTube video ID or YouTube playlist ID.
        """.trimIndent(),
        exampleUsages = listOf(
            "transatlantik",
            "p28K7Fz0KrQ",
            "PLpdRVFVH_vIMvkMVdJScNK3S2SeOv7k1d",
        ),
        parameters = CommandParameters(
            parameters = listOf(
                CommandParameters.RequiredMultiValue("video-name", "youtube-id", "youtube-playlist-id"),
            ),
        ),
        requiredScope = Scope.PLAYER_QUEUE,
    ) {
    override suspend fun execute(command: Command, context: ExecutionContext): CommandProcessingResult {
        val videoOrPlaylistId = command.rawArgs.orEmpty()
        if (videoOrPlaylistId.isEmpty()) {
            return error("Missing exact song name or youtube's video/playlist id.", logger)
        }

        val songs = mutableListOf<Song>()

        songsService.getSongByNameWithYouTubeIdFallback(videoOrPlaylistId)?.let {
            songs.add(it)
        } ?: run {
            songs += songsService.getSongsFromPlaylist(videoOrPlaylistId)
        }

        if (songs.isEmpty()) {
            return error("Could not queue any song.", logger)
        }

        // TODO: filter only embeddable

        eventStream.sendToEveryone(Event.QueueSongs(songs))

        songs.forEach { songsService.incrementPlayCount(it, context.session) }

        val messageLines = buildMessage(songs)
        return CommandProcessingResult.fromMultilineMarkdown(*messageLines.toTypedArray())
    }

    companion object {
        private const val MAX_TITLES_IN_MESSAGE = 10
        fun buildMessage(songsToQueue: List<Song>, requestedAmount: Int = 0): List<String> {
            val queuedCount = songsToQueue.count()
            val requestAmountText = if (queuedCount < requestedAmount) " from $requestedAmount requested" else ""

            return listOfNotNull(
                "Queued $queuedCount$requestAmountText:",
                *songsToQueue.take(MAX_TITLES_IN_MESSAGE).map { "- _${it.name}_" }.toTypedArray(),
                "...and others.".takeIf { queuedCount > MAX_TITLES_IN_MESSAGE },
            )
        }
    }
}
