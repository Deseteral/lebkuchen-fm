package xyz.lebkuchenfm.domain.xsounds

interface XSoundsRepository {
    suspend fun findAllOrderByNameAsc(): List<XSound>

    suspend fun findAllByTagOrderByNameAsc(tag: String): List<XSound>

    suspend fun insert(sound: XSound)

    suspend fun incrementPlayCount(soundName: String): XSound?

    suspend fun findAllUniqueTags(): List<String>

    suspend fun findByName(name: String): XSound?

    suspend fun addTagToXSound(name: String, tag: String): XSound?
}
