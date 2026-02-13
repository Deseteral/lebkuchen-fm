package xyz.lebkuchenfm.domain.songs

import com.github.michaelbull.result.getOr
import io.ktor.http.Url
import kotlinx.datetime.Clock
import xyz.lebkuchenfm.domain.auth.UserSession
import xyz.lebkuchenfm.domain.history.HistoryEntry
import xyz.lebkuchenfm.domain.history.HistoryRepository
import xyz.lebkuchenfm.domain.youtube.YouTubeRepository
import xyz.lebkuchenfm.domain.youtube.YouTubeVideoStreamRepository
import xyz.lebkuchenfm.domain.youtube.YoutubeVideo
import xyz.lebkuchenfm.domain.youtube.YoutubeVideoId

class SongsService(
    private val songsRepository: SongsRepository,
    private val youtubeRepository: YouTubeRepository,
    private val historyRepository: HistoryRepository,
    private val youTubeVideoStreamRepository: YouTubeVideoStreamRepository,
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
            historyRepository.insert(HistoryEntry(clock.now(), it.youtubeId, userSession.name))
        }
    }

    suspend fun getSongsFromPlaylist(playlistId: String): List<Song> {
        val youtubeVideos = youtubeRepository.findVideosByPlaylistId(playlistId)
        val songs = getOrCreateSongsCorrespondingToYoutubeVideos(youtubeVideos)
        return songs
    }

    suspend fun getSongByNameWithYouTubeIdFallback(nameOrYouTubeId: String): Song? {
        val foundByName = songsRepository.findByName(nameOrYouTubeId)
        foundByName?.let { return it }

        val maybeYoutubeId = nameOrYouTubeId
            .split(" ")
            .firstOrNull()
            ?.let { YoutubeVideoId(it) }
            ?: return null

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

    fun enrichSongWithVideoStreamUrl(song: Song): SongWithStream? {
        val url = youTubeVideoStreamRepository.getVideoStreamUrl(song.youtubeId) ?: return null
        return SongWithStream(song, SongWithStream.Stream(Url(url)))
    }

    private suspend fun createNewSong(youtubeId: YoutubeVideoId, songName: String): Song? {
        val newSong = Song(
            name = songName,
            youtubeId = youtubeId,
            timesPlayed = 0,
            trimStartSeconds = null,
            trimEndSeconds = null,
        )
        return songsRepository.insert(newSong).getOr(null)
    }

    private suspend fun getOrCreateSongsCorrespondingToYoutubeVideos(youtubeVideos: List<YoutubeVideo>): List<Song> {
        val youtubeIds = youtubeVideos.map { it.id }
        val knownSongs = songsRepository.findByYoutubeIds(youtubeIds)
        val knownIds = knownSongs.map { it.youtubeId }

        val newSongs = youtubeVideos
            .filterNot { it.id in knownIds }
            .mapNotNull { createNewSong(it.id, it.name) }

        return (knownSongs + newSongs).sortedBy { youtubeIds.indexOf(it.youtubeId) }
    }
}
