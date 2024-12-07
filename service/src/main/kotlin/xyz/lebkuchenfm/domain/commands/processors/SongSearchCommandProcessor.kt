package xyz.lebkuchenfm.domain.commands.processors

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.ExecutionContext
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.songs.SongsService

private val logger = KotlinLogging.logger {}

class SongSearchCommandProcessor(private val songsService: SongsService, private val eventStream: EventStream<*>) :
    CommandProcessor(
        key = "song-search",
        shortKey = "s",
        helpMessage = "Queue first result from Youtube search.",
        exampleUsages = listOf("japanese 80's hits"),
        parameters = CommandParameters(
            parameters = listOf(
                CommandParameters.RequiredCommandParameter("phrase"),
            ),
            delimiter = " ",
        ),
    ) {
    
    override suspend fun execute(command: Command, context: ExecutionContext): CommandProcessingResult {
        val phrase = command.rawArgs

        if (phrase.isNullOrBlank()) {
            return error("You have to provide search phrase.", logger)
        }

        val song = songsService.getSongFromYoutube(phrase)
            ?: return error("Could not find a song with provided phrase.", logger)

        eventStream.sendToEveryone(Event.QueueSongs(listOf(song)))
        songsService.incrementPlayCount(song, context.session)

        return CommandProcessingResult.fromMarkdown("Queued ${song.name}.")
    }
}
