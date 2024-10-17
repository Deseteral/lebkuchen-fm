package xyz.lebkuchenfm

class XSoundsService(private val repository: XSoundsRepository) {
    suspend fun getAllXSounds(): List<XSound> {
        return repository.findAll()
    }
}
