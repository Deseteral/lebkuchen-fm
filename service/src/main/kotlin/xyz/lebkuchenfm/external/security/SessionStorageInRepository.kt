package xyz.lebkuchenfm.external.security

import io.ktor.server.sessions.SessionStorage
import io.ktor.util.collections.ConcurrentMap
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import kotlinx.serialization.json.Json
import xyz.lebkuchenfm.domain.sessions.SessionsRepository
import xyz.lebkuchenfm.domain.sessions.UserSession
import kotlin.time.Duration.Companion.hours

class SessionStorageInRepository(
    private val sessionsRepository: SessionsRepository,
    private val clock: Clock,
) : SessionStorage {
    private val cache = ConcurrentMap<String, CachedSession>()
    private val expirationTime: Instant get() = clock.now() + 1.hours

    override suspend fun write(id: String, value: String) {
        val userSession: UserSession = Json.decodeFromString(value)
        sessionsRepository
            .upsert(id, userSession.name, value)
            ?.also { cache[id] = CachedSession(it, expirationTime) }
    }

    override suspend fun read(id: String): String {
        return cache[id]
            ?.takeIf { clock.now() < it.expireAt }?.value
            ?: sessionsRepository.findBySessionId(id)
                ?.also { cache[id] = CachedSession(it, expirationTime) }
            ?: throw NoSuchElementException("Session $id not found.")
    }

    override suspend fun invalidate(id: String) {
        cache.remove(id)
        sessionsRepository.remove(id)
    }

    data class CachedSession(
        val value: String,
        val expireAt: Instant,
    )
}
