package xyz.lebkuchenfm.external.storage.repos

import com.mongodb.client.model.Sorts
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId
import xyz.lebkuchenfm.domain.songs.Song
import xyz.lebkuchenfm.domain.songs.SongsRepository

class SongsMongoRepository(database: MongoDatabase) : SongsRepository {
    private val collection = database.getCollection<SongEntity>("songs")
    private val sortByName = Sorts.ascending(SongEntity::name.name)

    override suspend fun findAllOrderByNameAsc(): List<Song> {
        return collection
            .find()
            .sort(sortByName)
            .map { it.toDomain() }.toList()
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
