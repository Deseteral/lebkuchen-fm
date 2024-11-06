package xyz.lebkuchenfm.domain.songs

import com.github.michaelbull.result.get
import xyz.lebkuchenfm.external.youtube.YoutubeClient

class SongsService(private val repository: SongsRepository, private val youtubeClient: YoutubeClient) {
    suspend fun getAllSongs(): List<Song> {
        return repository.findAllOrderByNameAsc()
    }

    suspend fun incrementPlayCount(youtubeId: String): Song? {
        return repository.incrementYoutubePlayCount(youtubeId)
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
        val name = songName ?: youtubeClient.getVideoName(youtubeId).get()
        if (name == null) {
            return null
        }

        val newSong = Song(name, youtubeId, 0, null, null)
        repository.insert(newSong)
        return newSong
    }
}
