package xyz.lebkuchenfm.external.security

import io.ktor.server.sessions.SessionStorage
import io.ktor.server.sessions.SessionStorageMemory

class SessionStorageMongo : SessionStorage {
    // TODO: In-memory storage is temporary. We have to implement a custom storage using Mongo.
    private val storage = SessionStorageMemory()

    override suspend fun invalidate(id: String) {
        // TODO: Actually implement.
        storage.invalidate(id)
    }

    override suspend fun read(id: String): String {
        // TODO: Actually implement.
        return storage.read(id)
    }

    override suspend fun write(id: String, value: String) {
        // TODO: Actually implement.
        storage.write(id, value)
    }
}
