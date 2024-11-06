package xyz.lebkuchenfm.domain.songs

interface SongsRepository {
    suspend fun findAllOrderByNameAsc(): List<Song>
    suspend fun findRandomWithPhraseAndLimit(limit: Int, phrase: String?): List<Song>
}
