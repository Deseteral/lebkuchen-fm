package xyz.lebkuchenfm.domain.songs

class SongsService(private val repository: SongsRepository) {
    suspend fun getAllSongs(): List<Song> {
        return repository.findAllOrderByNameAsc()
    }
}
