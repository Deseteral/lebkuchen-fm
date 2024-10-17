package xyz.lebkuchenfm

import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.toList
import kotlinx.serialization.Serializable

class XSoundsRepository(database: MongoDatabase) {
    private val collection = database.getCollection<XSound>("x")

    suspend fun findAll(): List<XSound> {
        return collection.find().toList()
    }
}

@Serializable data class XSound(val name: String)
