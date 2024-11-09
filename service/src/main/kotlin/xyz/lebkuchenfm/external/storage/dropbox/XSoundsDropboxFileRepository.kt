package xyz.lebkuchenfm.external.storage.dropbox

import com.github.michaelbull.result.Result
import com.github.michaelbull.result.mapError
import io.ktor.server.config.ApplicationConfig
import xyz.lebkuchenfm.domain.xsounds.FileStorageError
import xyz.lebkuchenfm.domain.xsounds.XSoundsFileRepository
import java.nio.file.Paths

class XSoundsDropboxFileRepository(
    private val dropboxClient: DropboxClient,
    config: ApplicationConfig,
) : XSoundsFileRepository {
    private val storageFolderPath = config.property(DROPBOX_X_SOUND_PATH_PROPERTY_PATH).getString()

    override suspend fun uploadXSoundFile(soundName: String, byteArray: ByteArray): Result<String, FileStorageError> {
        val path = Paths.get(storageFolderPath, "$soundName.mp3")
        val result = dropboxClient.uploadFile(path.toString(), byteArray)
        return result.mapError { FileStorageError.FileCouldNotBeSaved }
    }

    private companion object {
        const val DROPBOX_X_SOUND_PATH_PROPERTY_PATH = "storage.dropbox.paths.xSounds"
    }
}
