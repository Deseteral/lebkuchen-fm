package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.coroutines.runSuspendCatching
import com.github.michaelbull.result.map
import com.github.michaelbull.result.mapError
import com.mongodb.MongoWriteException
import com.mongodb.client.model.Accumulators.addToSet
import com.mongodb.client.model.Aggregates.group
import com.mongodb.client.model.Aggregates.project
import com.mongodb.client.model.Aggregates.unwind
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.FindOneAndUpdateOptions
import com.mongodb.client.model.IndexOptions
import com.mongodb.client.model.Indexes
import com.mongodb.client.model.Projections
import com.mongodb.client.model.ReturnDocument
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
import xyz.lebkuchenfm.domain.xsounds.ListTagsForXSoundError
import xyz.lebkuchenfm.domain.xsounds.ListXSoundsTagsError
import xyz.lebkuchenfm.domain.xsounds.ListXSoundsWithTagError
import xyz.lebkuchenfm.domain.xsounds.RemoveTagFromXSoundError
import xyz.lebkuchenfm.domain.xsounds.XSound
import xyz.lebkuchenfm.domain.xsounds.XSoundsRepository
import xyz.lebkuchenfm.domain.xsounds.XSoundsRepositoryError
import xyz.lebkuchenfm.external.storage.mongo.isDuplicateKeyException

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
        return runSuspendCatching { collection.insertOne(sound.toEntity()) }
            .map { sound }
            .mapError { ex ->
                when {
                    ex is MongoWriteException && ex.isDuplicateKeyException -> XSoundsRepositoryError.SoundAlreadyExists
                    else -> XSoundsRepositoryError.UnknownError
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
                FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER),
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
                FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER),
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

    override suspend fun listTags(): Result<List<String>, ListXSoundsTagsError> {
        return try {
            val tags = collection.distinct<String>(XSoundEntity::tags.name).toList()
            Ok(tags)
        } catch (e: Exception) {
            Err(ListXSoundsTagsError.UnknownError)
        }
    }

    override suspend fun listTagsForXSound(name: String): Result<List<String>, ListTagsForXSoundError> {
        return try {
            val xSound = collection.find(eq(XSoundEntity::name.name, name)).toList().firstOrNull()
                ?: return Err(ListTagsForXSoundError.SoundDoesNotExist)
            Ok(xSound.tags ?: listOf())
        } catch (e: Exception) {
            Err(ListTagsForXSoundError.UnknownError)
        }
    }

    override suspend fun incrementPlayCount(soundName: String): XSound? {
        return collection.findOneAndUpdate(
            eq(XSoundEntity::name.name, soundName),
            inc(XSoundEntity::timesPlayed.name, 1),
            FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER),
        )?.toDomain()
    }
}

private data class XSoundEntity(
    @BsonId val id: ObjectId? = null,
    val name: String,
    val url: String,
    val timesPlayed: Int,
    val tags: List<String>?,
    val addedBy: String?,
) {
    fun toDomain(): XSound = XSound(
        name = this.name,
        url = this.url,
        tags = this.tags ?: emptyList(),
        timesPlayed = this.timesPlayed,
        addedBy = this.addedBy,
    )
}

private fun XSound.toEntity(): XSoundEntity = XSoundEntity(
    id = null,
    name = name,
    url = url,
    timesPlayed = timesPlayed,
    tags = tags,
    addedBy = addedBy,
)
