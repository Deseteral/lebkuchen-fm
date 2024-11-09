package xyz.lebkuchenfm.domain.songs

class SongsService(private val songsRepository: SongsRepository, private val youtubeRepository: YoutubeSongsRepository) {
    suspend fun getAllSongs(): List<Song> {
        return songsRepository.findAllOrderByNameAsc()
    }

    suspend fun incrementPlayCount(song: Song): Song? {
        return songsRepository.incrementPlayCountByName(song.name)
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
        val name = songName ?: youtubeRepository.findSongNameByYoutubeId(youtubeId) ?: return null
        val newSong = Song(name, youtubeId, timesPlayed = 0, trimStartSeconds = null, trimEndSeconds = null)
        val inserted = songsRepository.insert(newSong)
        return if (inserted)  { newSong } else { null }
    }
}
