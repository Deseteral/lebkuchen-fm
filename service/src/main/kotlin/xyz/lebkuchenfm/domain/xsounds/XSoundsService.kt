package xyz.lebkuchenfm.domain.xsounds

class XSoundsService(private val repository: XSoundsRepository, private val fileRepository: XSoundsFileRepository) {
    suspend fun getAllXSounds(): List<XSound> {
        return repository.findAllOrderByNameAsc()
    }

    suspend fun getAllXSoundsWithTag(tag: String): List<XSound> {
        return repository.findAllByTagOrderByNameAsc(tag)
    }

    suspend fun addNewXSound(
        soundName: String,
        tags: List<String>,
        bytes: ByteArray,
    ): XSound {
        val fileUrl = fileRepository.uploadXSoundFile(soundName, bytes)
        val readySound = XSound(name = soundName, url = fileUrl, tags = tags, addedBy = null)
        repository.insert(readySound)
        return readySound
    }

    suspend fun findAllUniqueTags(): List<String> {
        return repository.findAllUniqueTags()
    }
}
