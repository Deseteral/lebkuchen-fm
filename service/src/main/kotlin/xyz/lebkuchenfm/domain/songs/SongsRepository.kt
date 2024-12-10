package xyz.lebkuchenfm.domain.songs

import com.github.michaelbull.result.Result

interface SongsRepository {
    suspend fun insert(song: Song): Result<Song, InsertSongError>
    suspend fun findAllOrderByNameAsc(): List<Song>
    suspend fun findByName(name: String): Song?
    suspend fun findByYoutubeId(youtubeId: String): Song?
    suspend fun findByYoutubeIds(youtubeIds: List<String>): List<Song>
    suspend fun findRandom(limit: Int, phrase: String): List<Song>
    suspend fun incrementPlayCountByName(name: String): Song?
}

sealed class InsertSongError {
    data object UnknownError : InsertSongError()
}
