package xyz.lebkuchenfm.domain.xsounds

import com.github.michaelbull.result.Result

interface XSoundsRepository {
    suspend fun findAllOrderByNameAsc(): List<XSound>

    suspend fun findAllByTagOrderByNameAsc(tag: String): List<XSound>

    suspend fun insert(sound: XSound): Result<XSound, XSoundsRepositoryError>

    suspend fun incrementPlayCount(soundName: String): XSound?

    suspend fun findAllUniqueTags(): List<String>

    suspend fun findByName(name: String): XSound?

    suspend fun addTagToXSound(name: String, tag: String): Result<XSound, AddTagToXSoundError>
    suspend fun removeTagFromXSound(name: String, tag: String): Result<XSound, RemoveTagFromXSoundError>
    suspend fun listXSoundsWithTag(tag: String): Result<List<XSound>, ListXSoundsWithTagError>
    suspend fun listTags(): Result<List<String>, ListXSoundsTagsError>
    suspend fun listTagsForXSound(name: String): Result<List<String>, ListTagsForXSoundError>
}

sealed class RemoveTagFromXSoundError {
    data object SoundDoesNotExist : RemoveTagFromXSoundError()
    data object UnknownError : RemoveTagFromXSoundError()
}
sealed class AddTagToXSoundError {
    data object SoundDoesNotExist : AddTagToXSoundError()
    data object UnknownError : AddTagToXSoundError()
}

sealed class XSoundsRepositoryError {
    data object SoundAlreadyExists : XSoundsRepositoryError()
    data object UnknownError : XSoundsRepositoryError()
}

sealed class ListXSoundsWithTagError {
    data object UnknownError : ListXSoundsWithTagError()
}

sealed class ListXSoundsTagsError {
    data object UnknownError : ListXSoundsTagsError()
}

sealed class ListTagsForXSoundError {
    data object SoundDoesNotExist : ListTagsForXSoundError()
    data object UnknownError : ListTagsForXSoundError()
}
