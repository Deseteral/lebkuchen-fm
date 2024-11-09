package xyz.lebkuchenfm.domain.commands.processors

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.songs.Song
import xyz.lebkuchenfm.domain.songs.SongsService

private val logger = KotlinLogging.logger {}

class SongQueueCommandProcessor(private val songsService: SongsService, private val eventStream: EventStream) :
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
    ) {
    override suspend fun execute(command: Command): CommandProcessingResult {
        val videoOrPlaylistId = command.rawArgs.orEmpty()
        if (videoOrPlaylistId.isEmpty()) {
            return error("Missing exact song name or youtube's video/playlist id.", logger)
        }

        val songs = mutableListOf<Song>()

        songsService.getSongByNameWithYouTubeIdFallback(videoOrPlaylistId)?.let {
            songs.add(it)
        }

        // TODO: handle playlist

        if (songs.isEmpty()) {
            return error("Could not queue any song.", logger)
        }

        // TODO: filter only embeddable

        eventStream.sendToEveryone(Event.QueueSongs(songs))

        songs.forEach { songsService.incrementPlayCount(it) }

        val songNames = songs.joinToString(", ") { it.name }
        val message = "Queued $songNames."
        return CommandProcessingResult.fromMarkdown(message)
    }
}
