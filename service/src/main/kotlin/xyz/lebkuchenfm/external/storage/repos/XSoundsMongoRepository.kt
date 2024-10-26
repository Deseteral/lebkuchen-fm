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

    override suspend fun insert(sound: XSound) {
        collection.insertOne(XSoundEntity(sound))
    }
}

data class XSoundEntity(
    @BsonId val id: ObjectId? = null,
    val name: String,
    val url: String,
    val timesPlayed: Int,
    val tags: List<String>,
    val addedBy: String?,
) {
    constructor(sound: XSound) : this(
        null,
        sound.name,
        sound.url,
        0,
        sound.tags,
        sound.addedBy,
    )

    fun toDomain(): XSound {
        return XSound(name = this.name, url = this.url, tags = this.tags, addedBy = this.addedBy)
    }
}
