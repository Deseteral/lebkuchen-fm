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
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.songs.InsertSongError
import xyz.lebkuchenfm.domain.songs.Song
import xyz.lebkuchenfm.domain.songs.SongsRepository
import xyz.lebkuchenfm.domain.youtube.YoutubeVideoId

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

    override suspend fun findByYoutubeId(youtubeId: YoutubeVideoId): Song? {
        return collection.find(eq(SongEntity::youtubeId.name, youtubeId.value)).firstOrNull()?.toDomain()
    }

    override suspend fun findByYoutubeIds(youtubeIds: List<YoutubeVideoId>): List<Song> {
        return collection
            .find(`in`(SongEntity::youtubeId.name, youtubeIds.map { it.value }))
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

@Serializable
private data class SongEntity(
    val name: String,
    val youtubeId: String,
    val trimStartSeconds: Int?,
    val trimEndSeconds: Int?,
    val timesPlayed: Int,
) {
    fun toDomain(): Song = Song(
        name = this.name,
        youtubeId = YoutubeVideoId(this.youtubeId),
        trimStartSeconds = this.trimStartSeconds,
        trimEndSeconds = this.trimEndSeconds,
        timesPlayed = this.timesPlayed,
    )
}

private fun Song.toEntity(): SongEntity = SongEntity(
    name = name,
    youtubeId = youtubeId.value,
    trimStartSeconds = trimStartSeconds,
    trimEndSeconds = trimEndSeconds,
    timesPlayed = timesPlayed,
)
