package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.mongodb.MongoCommandException
import com.mongodb.client.model.Aggregates
import com.mongodb.client.model.Filters
import com.mongodb.client.model.Sorts
import com.mongodb.client.model.TextSearchOptions
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId
import xyz.lebkuchenfm.domain.songs.Song
import xyz.lebkuchenfm.domain.songs.SongsRepository

private val logger = KotlinLogging.logger {}

class SongsMongoRepository(database: MongoDatabase) : SongsRepository {
    private val collection = database.getCollection<SongEntity>("songs")
    private val sortByName = Sorts.ascending(SongEntity::name.name)
    private var atlasSearchAvailable = true
    private var textIndexExists = true

    override suspend fun findAllOrderByNameAsc(): List<Song> {
        return collection
            .find()
            .sort(sortByName)
            .map { it.toDomain() }.toList()
    }

    override suspend fun findRandomWithPhraseAndLimit(limit: Int, phrase: String?): List<Song> {
        // TODO: add atlas search
        val textSearch = phrase?.takeIf { textIndexExists }?.let {
            val options = TextSearchOptions().caseSensitive(false).diacriticSensitive(false)
            Aggregates.match(Filters.text(it, options))
        }
        val random = Aggregates.sample(limit)
        val aggregates = listOfNotNull(
            textSearch,
            random,
        )

        var result: List<Song>
        try {
            result = collection.aggregate<SongEntity>(aggregates).toList().map { it.toDomain() }
        } catch (e: MongoCommandException) {
            if (e.errorCode == 27) {
                textIndexExists = false
            }
            // TODO: add text index
            logger.error { e.errorMessage }
            logger.info { "Disabling text search." }
            // TODO: handle "partial" success? - phrase not applied
            result = findRandomWithPhraseAndLimit(limit, phrase)
        }

        return result
    }
}

data class SongEntity(
    @BsonId val id: ObjectId? = null,
    val name: String,
    val youtubeId: String,
    val trimStartSeconds: Int?,
    val trimEndSeconds: Int?,
    val timesPlayed: Int,
) {
    fun toDomain(): Song {
        return Song(
            name = this.name,
            youtubeId = this.youtubeId,
            trimStartSeconds = this.trimStartSeconds,
            trimEndSeconds = this.trimEndSeconds,
            timesPlayed = this.timesPlayed,
        )
    }
}
