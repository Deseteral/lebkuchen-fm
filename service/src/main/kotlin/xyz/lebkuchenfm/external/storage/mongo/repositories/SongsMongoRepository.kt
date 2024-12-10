package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.github.michaelbull.result.Result
import com.github.michaelbull.result.coroutines.runSuspendCatching
import com.github.michaelbull.result.map
import com.github.michaelbull.result.mapError
import com.mongodb.client.model.Aggregates
import com.mongodb.client.model.Filters
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Filters.`in`
import com.mongodb.client.model.FindOneAndUpdateOptions
import com.mongodb.client.model.IndexOptions
import com.mongodb.client.model.Indexes
import com.mongodb.client.model.ReturnDocument
import com.mongodb.client.model.Sorts
import com.mongodb.client.model.Updates.inc
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId
import xyz.lebkuchenfm.domain.songs.InsertSongError
import xyz.lebkuchenfm.domain.songs.Song
import xyz.lebkuchenfm.domain.songs.SongsRepository

class SongsMongoRepository(database: MongoDatabase) : SongsRepository {
    private val collection = database.getCollection<SongEntity>("songs")
    private val sortByName = Sorts.ascending(SongEntity::name.name)

    suspend fun createTextIndex() {
        val options = IndexOptions().name("text_name")
        collection.createIndex(Indexes.text(SongEntity::name.name), options)
    }

    override suspend fun insert(song: Song): Result<Song, InsertSongError> {
        return runSuspendCatching { collection.insertOne(song.toEntity()) }
            .map { song }
            .mapError { InsertSongError.UnknownError }
    }

    override suspend fun findAllOrderByNameAsc(): List<Song> {
        return collection
            .find()
            .sort(sortByName)
            .map { it.toDomain() }.toList()
    }

    override suspend fun findByName(name: String): Song? {
        return collection.find(eq(SongEntity::name.name, name)).firstOrNull()?.toDomain()
    }

    override suspend fun findByYoutubeId(youtubeId: String): Song? {
        return collection.find(eq(SongEntity::youtubeId.name, youtubeId)).firstOrNull()?.toDomain()
    }

    override suspend fun findByYoutubeIds(youtubeIds: List<String>): List<Song> {
        return collection
            .find(`in`(SongEntity::youtubeId.name, youtubeIds))
            .map { it.toDomain() }
            .toList()
    }

    override suspend fun findRandom(limit: Int, phrase: String): List<Song> {
        return collection.aggregate(
            listOfNotNull(
                Aggregates.match(Filters.text(phrase)).takeIf { phrase.isNotBlank() },
                Aggregates.sample(limit),
            ),
        ).map { it.toDomain() }.toList()
    }

    override suspend fun incrementPlayCountByName(name: String): Song? {
        return collection.findOneAndUpdate(
            eq(SongEntity::name.name, name),
            inc(SongEntity::timesPlayed.name, 1),
            FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER),
        )?.toDomain()
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

private fun Song.toEntity(): SongEntity = SongEntity(
    id = null,
    name = name,
    youtubeId = youtubeId,
    trimStartSeconds = trimStartSeconds,
    trimEndSeconds = trimEndSeconds,
    timesPlayed = timesPlayed,
)
