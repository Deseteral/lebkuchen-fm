package xyz.lebkuchenfm.domain.songs

import com.github.michaelbull.result.get
import xyz.lebkuchenfm.external.youtube.YoutubeClient

class SongsService(private val repository: SongsRepository, private val youtubeClient: YoutubeClient) {
    suspend fun getAllSongs(): List<Song> {
        return repository.findAllOrderByNameAsc()
    }

    suspend fun incrementPlayCount(song: Song): Song? {
        return repository.incrementPlayCountByName(song.name)
    }

    suspend fun getSongByNameWithYouTubeIdFallback(nameOrYouTubeId: String): Song? {
        val foundByName = repository.findByName(nameOrYouTubeId)
        foundByName?.let { return it }

        val maybeYoutubeId = nameOrYouTubeId.split(" ").firstOrNull()

        return maybeYoutubeId?.let {
            repository.findByYoutubeId(it) ?: createNewSong(it)
        }
    }

    private suspend fun createNewSong(youtubeId: String, songName: String? = null): Song? {
        val name = songName ?: youtubeClient.getVideoName(youtubeId).get() ?: return null
        val newSong = Song(name, youtubeId, timesPlayed = 0, trimStartSeconds = null, trimEndSeconds = null)
        val inserted = repository.insert(newSong)
        return if (inserted)  { newSong } else { null }
    }
}
