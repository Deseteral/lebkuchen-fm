package xyz.lebkuchenfm.external.storage.dropbox

import io.ktor.server.config.ApplicationConfig
import xyz.lebkuchenfm.domain.xsounds.XSoundsFileRepository

class XSoundsDropboxFileRepository(
    private val fileStorage: DropboxFileStorage,
    config: ApplicationConfig,
) : XSoundsFileRepository {
    private val storageFolderPath = config.property(DROPBOX_X_SOUND_PATH_PROPERTY_PATH).getString()

    override suspend fun uploadXSoundFile(
        soundName: String,
        byteArray: ByteArray,
    ): String {
        val path = "$storageFolderPath$soundName.mp3"
        val url = fileStorage.uploadFile(path, byteArray)
        return url
    }

    private companion object {
        const val DROPBOX_X_SOUND_PATH_PROPERTY_PATH = "storage.dropbox.paths.xSounds"
    }
}
