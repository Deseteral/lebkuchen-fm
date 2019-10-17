package xyz.deseteral.lebkuchenfm.domain.x

interface XSoundRepository {
    fun findAll() : List<XSound>
    fun findByName(name: String) : XSound?
    fun save(xSound: XSound)
}
