package xyz.lebkuchenfm.domain.xsounds

import com.github.michaelbull.result.Result

interface XSoundsRepository {
    suspend fun findAllOrderByNameAsc(): List<XSound>

    suspend fun findAllByTagOrderByNameAsc(tag: String): List<XSound>

    suspend fun insert(sound: XSound)

    suspend fun incrementPlayCount(soundName: String): XSound?

    suspend fun findAllUniqueTags(): List<String>

    suspend fun findByName(name: String): XSound?

    suspend fun addTagToXSound(name: String, tag: String): Result<XSound, AddXTagToXSoundError>
}

sealed class AddXTagToXSoundError {
    data object SoundDoesNotExist : AddXTagToXSoundError()
    data object UnknownError : AddXTagToXSoundError()
}
