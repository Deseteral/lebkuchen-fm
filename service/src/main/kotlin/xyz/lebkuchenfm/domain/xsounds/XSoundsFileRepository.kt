package xyz.lebkuchenfm.domain.xsounds

import com.github.michaelbull.result.Result

interface XSoundsFileRepository {
    suspend fun uploadXSoundFile(soundName: String, byteArray: ByteArray): Result<String, UploadXSoundFileError>
}

sealed class UploadXSoundFileError {
    data object FileCouldNotBeSaved : UploadXSoundFileError()
}
