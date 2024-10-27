package xyz.lebkuchenfm.domain.xsounds

interface XSoundsFileRepository {
    suspend fun uploadXSoundFile(soundName: String, byteArray: ByteArray): String
}
