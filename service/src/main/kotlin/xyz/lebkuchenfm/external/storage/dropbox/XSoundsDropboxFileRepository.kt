package xyz.lebkuchenfm.external.storage.dropbox

import com.github.michaelbull.result.Result
import com.github.michaelbull.result.mapError
import xyz.lebkuchenfm.domain.xsounds.UploadXSoundFileError
import xyz.lebkuchenfm.domain.xsounds.XSoundsFileRepository
import java.nio.file.Paths

class XSoundsDropboxFileRepository(
    private val dropboxClient: DropboxClient,
    xSoundsPath: String?,
) : XSoundsFileRepository {
    private var storageFolderPath: String = xSoundsPath ?: DEFAULT_X_SOUNDS_PATH

    fun setStoragePath(xSoundsPath: String?) {
        storageFolderPath = xSoundsPath ?: DEFAULT_X_SOUNDS_PATH
    }

    override suspend fun uploadXSoundFile(
        soundName: String,
        byteArray: ByteArray,
    ): Result<String, UploadXSoundFileError> {
        val path = Paths.get(storageFolderPath, "$soundName.mp3")
        val result = dropboxClient.uploadFile(path.toString(), byteArray)
        return result.mapError { UploadXSoundFileError.FileCouldNotBeSaved }
    }

    private companion object {
        const val DEFAULT_X_SOUNDS_PATH = "/xsounds/"
    }
}
