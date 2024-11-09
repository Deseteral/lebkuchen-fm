package xyz.lebkuchenfm.domain.xsounds

import com.github.michaelbull.result.Result

interface XSoundsFileRepository {
    suspend fun uploadXSoundFile(soundName: String, byteArray: ByteArray): Result<String, FileStorageError>
}

sealed interface FileStorageError {
    data object FileCouldNotBeSaved : FileStorageError
}
