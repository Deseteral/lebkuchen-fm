package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.mongodb.ErrorCategory
import com.mongodb.MongoWriteException
import com.mongodb.client.model.Accumulators.addToSet
import com.mongodb.client.model.Aggregates.group
import com.mongodb.client.model.Aggregates.project
import com.mongodb.client.model.Aggregates.unwind
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.IndexOptions
import com.mongodb.client.model.Indexes
import com.mongodb.client.model.Projections
import com.mongodb.client.model.Sorts
import com.mongodb.client.model.Updates
import com.mongodb.client.model.Updates.inc
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId
import xyz.lebkuchenfm.domain.xsounds.AddTagToXSoundError
import xyz.lebkuchenfm.domain.xsounds.ListXSoundsWithTagError
import xyz.lebkuchenfm.domain.xsounds.RemoveTagFromXSoundError
import xyz.lebkuchenfm.domain.xsounds.XSound
import xyz.lebkuchenfm.domain.xsounds.XSoundsRepository
import xyz.lebkuchenfm.domain.xsounds.XSoundsRepositoryError

class XSoundsMongoRepository(database: MongoDatabase) : XSoundsRepository {
    private val collection = database.getCollection<XSoundEntity>("x")
    private val sortByName = Sorts.ascending(XSoundEntity::name.name)

    suspend fun createUniqueIndex() {
        val index = Indexes.ascending(XSoundEntity::name.name)
        val options = IndexOptions().unique(true).name("unique_name")
        collection.createIndex(index, options)
    }

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

    override suspend fun insert(sound: XSound): Result<XSound, XSoundsRepositoryError> {
        return try {
            if (collection.insertOne(XSoundEntity(sound)).wasAcknowledged()) {
                Ok(sound)
            } else {
                Err(XSoundsRepositoryError.UnknownError)
            }
        } catch (e: MongoWriteException) {
            if (e.error.category == ErrorCategory.DUPLICATE_KEY) {
                Err(XSoundsRepositoryError.SoundAlreadyExists)
            } else {
                Err((XSoundsRepositoryError.UnknownError))
            }
        }
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

    override suspend fun addTagToXSound(name: String, tag: String): Result<XSound, AddTagToXSoundError> {
        val xSound = try {
            collection.findOneAndUpdate(
                eq(XSoundEntity::name.name, name),
                Updates.addToSet(XSoundEntity::tags.name, tag),
            )
        } catch (e: Exception) {
            return Err(AddTagToXSoundError.UnknownError)
        }

        if (xSound == null) {
            return Err(AddTagToXSoundError.SoundDoesNotExist)
        }
        return Ok(xSound.toDomain())
    }

    override suspend fun removeTagFromXSound(name: String, tag: String): Result<XSound, RemoveTagFromXSoundError> {
        val xSound = try {
            collection.findOneAndUpdate(
                eq(XSoundEntity::name.name, name),
                Updates.pull(XSoundEntity::tags.name, tag),
            )
        } catch (e: Exception) {
            return Err(RemoveTagFromXSoundError.UnknownError)
        }

        if (xSound == null) {
            return Err(RemoveTagFromXSoundError.SoundDoesNotExist)
        }
        return Ok(xSound.toDomain())
    }

    override suspend fun listXSoundsWithTag(tag: String): Result<List<XSound>, ListXSoundsWithTagError> {
        return try {
            val sounds = collection.find(eq(XSoundEntity::tags.name, tag)).map { it.toDomain() }.toList()
            Ok(sounds)
        } catch (e: Exception) {
            Err(ListXSoundsWithTagError.UnknownError)
        }
    }

    override suspend fun incrementPlayCount(soundName: String): XSound? {
        return collection.findOneAndUpdate(
            eq(XSoundEntity::name.name, soundName),
            inc(XSoundEntity::timesPlayed.name, 1),
        )?.toDomain()
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
