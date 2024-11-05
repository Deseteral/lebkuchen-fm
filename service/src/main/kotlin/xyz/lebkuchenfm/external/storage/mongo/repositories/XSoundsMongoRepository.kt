package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.mongodb.client.model.Accumulators.addToSet
import com.mongodb.client.model.Aggregates.group
import com.mongodb.client.model.Aggregates.project
import com.mongodb.client.model.Aggregates.unwind
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Projections
import com.mongodb.client.model.Sorts
import com.mongodb.client.model.Updates.inc
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId
import xyz.lebkuchenfm.domain.xsounds.XSound
import xyz.lebkuchenfm.domain.xsounds.XSoundsRepository

class XSoundsMongoRepository(database: MongoDatabase) : XSoundsRepository {
    private val collection = database.getCollection<XSoundEntity>("x")
    private val sortByName = Sorts.ascending(XSoundEntity::name.name)

    override suspend fun findAllOrderByNameAsc(): List<XSound> {
        return collection
            .find()
            .sort(sortByName)
            .map { it.toDomain() }.toList()
    }

    override suspend fun findAllByTagOrderByNameAsc(tag: String): List<XSound> {
        val filter = eq(XSoundEntity::tags.name, tag)
        return collection
            .find(filter)
            .sort(sortByName)
            .map { it.toDomain() }.toList()
    }

    override suspend fun insert(sound: XSound) {
        collection.insertOne(XSoundEntity(sound))
    }

    override suspend fun findAllUniqueTags(): List<String> {
        val unwind = unwind("\$${XSound::tags.name}")
        val group = group(null, addToSet("tagsSet", "\$${XSound::tags.name}"))
        val project = project(Projections.include("tagsSet"))

        data class Result(val tagsSet: List<String>)

        val result = collection.aggregate<Result>(
            listOf(unwind, group, project),
        ).first()
        return result.tagsSet
    }

    override suspend fun findByName(name: String): XSound? {
        return collection.find(eq(XSoundEntity::name.name, name)).firstOrNull()?.toDomain()
    }

    override suspend fun incrementPlayCount(sound: XSound) {
        collection.findOneAndUpdate(
            eq(XSoundEntity::name.name, sound.name),
            inc(XSoundEntity::timesPlayed.name, 1),
        )
    }
}

data class XSoundEntity(
    @BsonId val id: ObjectId? = null,
    val name: String,
    val url: String,
    val timesPlayed: Int,
    val tags: List<String>?,
    val addedBy: String?,
) {
    constructor(sound: XSound) : this(
        null,
        sound.name,
        sound.url,
        sound.timesPlayed,
        sound.tags,
        sound.addedBy,
    )

    fun toDomain(): XSound = XSound(
        name = this.name,
        url = this.url,
        tags = this.tags ?: emptyList(),
        timesPlayed = this.timesPlayed,
        addedBy = this.addedBy,
    )
}
