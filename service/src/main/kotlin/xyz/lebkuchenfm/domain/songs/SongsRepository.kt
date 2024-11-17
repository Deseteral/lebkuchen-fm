package xyz.lebkuchenfm.domain.songs

interface SongsRepository {
    suspend fun insert(song: Song): Boolean
    suspend fun findAllOrderByNameAsc(): List<Song>
    suspend fun findByName(name: String): Song?
    suspend fun findByYoutubeId(youtubeId: String): Song?
    suspend fun findRandom(limit: Int, phrase: String): List<Song>
    suspend fun incrementPlayCountByName(name: String): Song?
}
