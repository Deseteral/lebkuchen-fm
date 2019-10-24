package xyz.deseteral.lebkuchenfm.domain.x

import org.springframework.dao.DuplicateKeyException
import org.springframework.stereotype.Service

@Service
class XSoundService(private val xSoundRepository: XSoundRepository) {
    fun getAllXSounds(): List<XSound> {
        return xSoundRepository
            .findAll()
            .sortedBy { it.name }
            .toList()
    }

    fun addNewSound(soundName: String, url: String) {
        val xSound = XSound(soundName, url, timesPlayed = 0)

        try {
            xSoundRepository.save(xSound)
        } catch (ex: DuplicateKeyException) {
            throw SoundAlreadyExistsException(soundName)
        }
    }
}
