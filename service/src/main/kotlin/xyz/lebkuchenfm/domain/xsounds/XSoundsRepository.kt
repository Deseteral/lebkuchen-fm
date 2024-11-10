package xyz.lebkuchenfm.domain.xsounds

import com.github.michaelbull.result.Result

interface XSoundsRepository {
    suspend fun findAllOrderByNameAsc(): List<XSound>

    suspend fun findAllByTagOrderByNameAsc(tag: String): List<XSound>

    suspend fun insert(sound: XSound): Result<XSound, XSoundsRepositoryError>

    suspend fun incrementPlayCount(soundName: String): XSound?

    suspend fun findAllUniqueTags(): List<String>

    suspend fun findByName(name: String): XSound?
}

sealed class XSoundsRepositoryError {
    data object SoundAlreadyExists : XSoundsRepositoryError()
    data object UnknownError : XSoundsRepositoryError()
}
