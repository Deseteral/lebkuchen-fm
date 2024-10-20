package xyz.lebkuchenfm.external.storage.repos

import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId
import xyz.lebkuchenfm.domain.xsounds.XSound
import xyz.lebkuchenfm.domain.xsounds.XSoundsRepository

class XSoundsMongoRepository(database: MongoDatabase) : XSoundsRepository {
    private val collection = database.getCollection<XSoundEntity>("x")

    override suspend fun findAll(): List<XSound> {
        return collection.find().map { it.toDomain() }.toList()
    }
}

data class XSoundEntity(
    @BsonId val id: ObjectId,
    val name: String,
) {
    fun toDomain(): XSound {
        return XSound(id = this.id.toString(), name = this.name)
    }
}
