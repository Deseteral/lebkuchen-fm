package xyz.lebkuchenfm.domain.xsounds

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.get
import com.github.michaelbull.result.mapError
import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.auth.UserSession

private val logger = KotlinLogging.logger {}

class XSoundsService(private val repository: XSoundsRepository, private val fileRepository: XSoundsFileRepository) {
    suspend fun getAllXSounds(): List<XSound> {
        return repository.findAllOrderByNameAsc()
    }

    suspend fun getAllXSoundsWithTag(tag: String): List<XSound> {
        return repository.findAllByTagOrderByNameAsc(tag)
    }

    sealed interface NewSoundError {
        data object FileStorageError : NewSoundError
        data object DatabaseError : NewSoundError
    }

    suspend fun addNewXSound(
        soundName: String,
        tags: List<String>,
        bytes: ByteArray,
        userSession: UserSession,
    ): Result<XSound, NewSoundError> {
        val fileUrl = fileRepository.uploadXSoundFile(soundName, bytes).get()
            ?: return Err(NewSoundError.FileStorageError)
        val readySound = XSound(
            name = soundName,
            url = fileUrl,
            tags = tags,
            timesPlayed = 0,
            addedBy = userSession.name,
        )
        val insertResult = repository.insert(readySound)
        return insertResult.mapError {
            logger.error { it }
            NewSoundError.DatabaseError
        }
    }

    suspend fun findAllUniqueTags(): List<String> {
        return repository.findAllUniqueTags()
    }

    suspend fun getByName(soundName: String): XSound? {
        return repository.findByName(soundName)
    }

    suspend fun markAsPlayed(soundName: String) {
        repository.incrementPlayCount(soundName) ?: run {
            logger.error { "Could not increment play count for sound $soundName" }
        }
    }

    sealed interface AddTagError {
        data object SoundDoesNotExist : AddTagError
        data object UnknownError : AddTagError
    }

    suspend fun addTagToXSound(soundName: String, tag: String): Result<XSound, AddTagError> {
        return repository.addTagToXSound(soundName, tag)
            .mapError { err ->
                when (err) {
                    is AddTagToXSoundError.SoundDoesNotExist -> AddTagError.SoundDoesNotExist
                    is AddTagToXSoundError.UnknownError -> AddTagError.UnknownError
                }
            }
    }

    sealed interface RemoveTagError {
        data object SoundDoesNotExist : RemoveTagError
        data object UnknownError : RemoveTagError
    }
    suspend fun removeTagFromXSound(soundName: String, tag: String): Result<XSound, RemoveTagError> {
        return repository.removeTagFromXSound(soundName, tag)
            .mapError { err ->
                when (err) {
                    is RemoveTagFromXSoundError.SoundDoesNotExist -> RemoveTagError.SoundDoesNotExist
                    is RemoveTagFromXSoundError.UnknownError -> RemoveTagError.UnknownError
                }
            }
    }
}
