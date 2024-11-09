package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Sorts
import com.mongodb.client.model.Updates.inc
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId
import xyz.lebkuchenfm.domain.songs.Song
import xyz.lebkuchenfm.domain.songs.SongsRepository

class SongsMongoRepository(database: MongoDatabase) : SongsRepository {
    private val collection = database.getCollection<SongEntity>("songs")
    private val sortByName = Sorts.ascending(SongEntity::name.name)

    override suspend fun insert(song: Song): Boolean {
        return collection.insertOne(SongEntity(song)).wasAcknowledged()
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

    override suspend fun incrementPlayCountByName(name: String): Song? {
        return collection.findOneAndUpdate(
            eq(SongEntity::name.name, name),
            inc(SongEntity::timesPlayed.name, 1),
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
    constructor(song: Song) : this(
        null,
        song.name,
        song.youtubeId,
        song.trimStartSeconds,
        song.trimEndSeconds,
        song.timesPlayed,
    )

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
