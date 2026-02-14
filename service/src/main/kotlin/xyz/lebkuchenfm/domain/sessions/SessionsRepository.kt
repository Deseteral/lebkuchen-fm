package xyz.lebkuchenfm.domain.sessions

interface SessionsRepository {
    suspend fun upsert(sessionId: String, userId: String, cookieValue: String): String?
    suspend fun findBySessionId(sessionId: String): String?
    suspend fun findSessionIdsByUserId(userId: String): List<String>
    suspend fun remove(sessionId: String)
    suspend fun removeAll(userId: String)
}
