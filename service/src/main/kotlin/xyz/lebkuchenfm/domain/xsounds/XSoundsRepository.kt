package xyz.lebkuchenfm.domain.xsounds

interface XSoundsRepository {
    suspend fun findAll(): List<XSound>
}
