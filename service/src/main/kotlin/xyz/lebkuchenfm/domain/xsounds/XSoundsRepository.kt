package xyz.lebkuchenfm.domain.xsounds

interface XSoundsRepository {
    suspend fun findAll(): List<XSound>

    suspend fun insert(sound: XSound)
}
