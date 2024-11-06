package xyz.lebkuchenfm.domain.songs

class SongsService(private val repository: SongsRepository) {
    suspend fun getAllSongs(): List<Song> {
        return repository.findAllOrderByNameAsc()
    }

    suspend fun getRandomAvailableSongs(quantity: Int, phrase: String?): List<Song> {
        // TODO: we should get more songs than requested from repository and check with youtube if they are still available

        return repository.findRandomWithPhraseAndLimit(quantity, phrase)
    }

    companion object {
        const val MAX_SONGS_IN_YOUTUBE_REQUEST = 50
    }
}
