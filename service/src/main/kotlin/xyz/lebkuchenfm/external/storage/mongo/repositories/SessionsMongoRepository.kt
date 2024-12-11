package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.FindOneAndUpdateOptions
import com.mongodb.client.model.ReturnDocument
import com.mongodb.client.model.Updates.set
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.firstOrNull

class SessionsMongoRepository(database: MongoDatabase) {
    private val collection = database.getCollection<SessionsEntity>("sessions")

    suspend fun upsert(id: String, value: String): String? {
        return collection.findOneAndUpdate(
            eq(SessionsEntity::sessionId.name, id),
            set(SessionsEntity::value.name, value),
            FindOneAndUpdateOptions().upsert(true).returnDocument(ReturnDocument.AFTER),
        )?.value
    }

    suspend fun findById(id: String): String? {
        return collection.find(eq(SessionsEntity::sessionId.name, id)).firstOrNull()?.value
    }

    suspend fun remove(id: String) {
        collection.deleteOne(eq(SessionsEntity::sessionId.name, id))
    }
}

data class SessionsEntity(
    val sessionId: String,
    val value: String,
)
