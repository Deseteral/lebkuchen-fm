package xyz.lebkuchenfm.domain.songs

import com.github.michaelbull.result.getOr
import kotlinx.datetime.Clock
import xyz.lebkuchenfm.domain.auth.UserSession
import xyz.lebkuchenfm.domain.history.HistoryEntry
import xyz.lebkuchenfm.domain.history.HistoryRepository
import xyz.lebkuchenfm.domain.youtube.YouTubeRepository

class SongsService(
    private val songsRepository: SongsRepository,
    private val youtubeRepository: YouTubeRepository,
    private val historyRepository: HistoryRepository,
    private val clock: Clock,
) {
    suspend fun getAllSongs(): List<Song> {
        return songsRepository.findAllOrderByNameAsc()
    }

    suspend fun getRandomSongs(limit: Int, phrase: String): List<Song> {
        return songsRepository.findRandom(limit, phrase)
    }

    suspend fun incrementPlayCount(song: Song, userSession: UserSession): Song? {
        return songsRepository.incrementPlayCountByName(song.name)?.also {
            historyRepository.insert(HistoryEntry(clock.now(), it.name, userSession.name))
        }
    }

    suspend fun getSongByNameWithYouTubeIdFallback(nameOrYouTubeId: String): Song? {
        val foundByName = songsRepository.findByName(nameOrYouTubeId)
        foundByName?.let { return it }

        val maybeYoutubeId = nameOrYouTubeId.split(" ").firstOrNull() ?: return null

        val foundById = songsRepository.findByYoutubeId(maybeYoutubeId)
        foundById?.let { return it }

        val foundOnYoutube = youtubeRepository.findVideoById(maybeYoutubeId)
        foundOnYoutube?.let {
            createNewSong(foundOnYoutube.id, foundOnYoutube.name)
        }.also {
            return it
        }
    }

    suspend fun getSongFromYoutube(searchPhrase: String): Song? {
        val foundOnYoutube = youtubeRepository.findVideoByPhrase(searchPhrase)
        foundOnYoutube?.let {
            songsRepository.findByYoutubeId(foundOnYoutube.id) ?: createNewSong(foundOnYoutube.id, foundOnYoutube.name)
        }.also {
            return it
        }
    }

    private suspend fun createNewSong(youtubeId: String, songName: String): Song? {
        val newSong = Song(
            name = songName,
            youtubeId = youtubeId,
            timesPlayed = 0,
            trimStartSeconds = null,
            trimEndSeconds = null,
        )
        return songsRepository.insert(newSong).getOr(null)
    }
}
