package xyz.lebkuchenfm.domain.xsounds

import io.github.oshai.kotlinlogging.KotlinLogging

private val logger = KotlinLogging.logger {}

class XSoundsService(private val repository: XSoundsRepository, private val fileRepository: XSoundsFileRepository) {
    suspend fun getAllXSounds(): List<XSound> {
        return repository.findAllOrderByNameAsc()
    }

    suspend fun getAllXSoundsWithTag(tag: String): List<XSound> {
        return repository.findAllByTagOrderByNameAsc(tag)
    }

    suspend fun addNewXSound(soundName: String, tags: List<String>, bytes: ByteArray): XSound {
        val fileUrl = fileRepository.uploadXSoundFile(soundName, bytes)
        val readySound = XSound(name = soundName, url = fileUrl, tags = tags, timesPlayed = 0, addedBy = null)
        repository.insert(readySound)
        return readySound
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
}
