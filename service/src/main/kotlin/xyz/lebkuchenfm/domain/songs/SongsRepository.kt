package xyz.lebkuchenfm.domain.songs

interface SongsRepository {
    suspend fun findAllOrderByNameAsc(): List<Song>
}
