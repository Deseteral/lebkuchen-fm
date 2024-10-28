package xyz.lebkuchenfm.external.storage.dropbox

import io.ktor.server.config.ApplicationConfig
import xyz.lebkuchenfm.domain.xsounds.XSoundsFileRepository
import java.nio.file.Paths

class XSoundsDropboxFileRepository(
    private val dropboxClient: DropboxFileStorage,
    config: ApplicationConfig,
) : XSoundsFileRepository {
    private val storageFolderPath = config.property(DROPBOX_X_SOUND_PATH_PROPERTY_PATH).getString()

    override suspend fun uploadXSoundFile(soundName: String, byteArray: ByteArray): String {
        val path = Paths.get(storageFolderPath, "$soundName.mp3")
        val url = dropboxClient.uploadFile(path.toString(), byteArray)
        return url
    }

    private companion object {
        const val DROPBOX_X_SOUND_PATH_PROPERTY_PATH = "storage.dropbox.paths.xSounds"
    }
}
