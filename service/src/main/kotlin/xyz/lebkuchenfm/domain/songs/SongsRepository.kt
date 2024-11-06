package xyz.lebkuchenfm.domain.songs

interface SongsRepository {
    suspend fun insert(song: Song)
    suspend fun findAllOrderByNameAsc(): List<Song>
    suspend fun findByName(name: String): Song?
    suspend fun findByYoutubeId(youtubeId: String): Song?
    suspend fun incrementYoutubePlayCount(youtubeId: String): Song?
}
