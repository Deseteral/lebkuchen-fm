package xyz.lebkuchenfm.domain.xsounds

class XSoundsService(private val repository: XSoundsRepository) {
    suspend fun getAllXSounds(): List<XSound> {
        return repository.findAll()
    }
}
