package xyz.lebkuchenfm.domain.songs

import kotlinx.datetime.Clock
import xyz.lebkuchenfm.domain.auth.UserSession
import xyz.lebkuchenfm.domain.history.HistoryEntry
import xyz.lebkuchenfm.domain.history.HistoryRepository
import xyz.lebkuchenfm.domain.youtube.YouTubeRepository

class SongsService(
    private val songsRepository: SongsRepository,
    private val youtubeRepository: YouTubeRepository,
    private val historyRepository: HistoryRepository,
) {
    suspend fun getAllSongs(): List<Song> {
        return songsRepository.findAllOrderByNameAsc()
    }

    suspend fun incrementPlayCount(song: Song, userSession: UserSession): Song? {
        return songsRepository.incrementPlayCountByName(song.name)?.also {
            historyRepository.insert(HistoryEntry(Clock.System.now(), it.name, userSession.name))
        }
    }

    suspend fun getSongByNameWithYouTubeIdFallback(nameOrYouTubeId: String): Song? {
        val foundByName = songsRepository.findByName(nameOrYouTubeId)
        foundByName?.let { return it }

        val maybeYoutubeId = nameOrYouTubeId.split(" ").firstOrNull()

        return maybeYoutubeId?.let { youtubeId ->
            songsRepository.findByYoutubeId(youtubeId) ?: createNewSong(youtubeId)
        }
    }

    private suspend fun createNewSong(youtubeId: String, songName: String? = null): Song? {
        val youtubeVideo = youtubeRepository.findVideoById(youtubeId) ?: return null
        val newSong = Song(
            name = songName ?: youtubeVideo.name,
            youtubeId = youtubeVideo.id,
            timesPlayed = 0,
            trimStartSeconds = null,
            trimEndSeconds = null,
        )
        val inserted = songsRepository.insert(newSong)
        return if (inserted) {
            newSong
        } else {
            null
        }
    }
}
