package xyz.lebkuchenfm.external.security

import io.ktor.server.sessions.SessionStorage
import io.ktor.util.collections.ConcurrentMap
import xyz.lebkuchenfm.external.storage.mongo.repositories.SessionsMongoRepository

class SessionStorageMongo(
    private val sessionsRepository: SessionsMongoRepository,
) : SessionStorage {
    private val cache = ConcurrentMap<String, String>()

    override suspend fun write(id: String, value: String) {
        sessionsRepository.upsert(id, value)?.also { cache[id] = value }
    }

    override suspend fun read(id: String): String {
        return cache[id]
            ?: run { sessionsRepository.findById(id) }?.also { cache[id] = it }
            ?: throw NoSuchElementException("Session $id not found.")
    }

    override suspend fun invalidate(id: String) {
        cache.remove(id)
        sessionsRepository.remove(id)
    }
}
