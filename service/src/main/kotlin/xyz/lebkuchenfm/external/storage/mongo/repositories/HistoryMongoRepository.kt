package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.mongodb.MongoWriteException
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.history.HistoryEntry
import xyz.lebkuchenfm.domain.history.HistoryRepository
import xyz.lebkuchenfm.domain.history.HistoryRepositoryError

class HistoryMongoRepository(database: MongoDatabase) : HistoryRepository {
    private val collection = database.getCollection<HistoryEntity>("history")

    override suspend fun insert(history: HistoryEntry): Result<HistoryEntry, HistoryRepositoryError> {
        return try {
            if (collection.insertOne(history.toEntity()).wasAcknowledged()) {
                Ok(history)
            } else {
                Err(HistoryRepositoryError.UnknownError)
            }
        } catch (e: MongoWriteException) {
            Err(HistoryRepositoryError.UnknownError)
        }
    }
}

@Serializable
data class HistoryEntity(
    @Contextual val date: Instant,
    val youtubeId: String,
    val user: String?,
)

fun HistoryEntry.toEntity(): HistoryEntity {
    return HistoryEntity(this.date, this.youtubeId, this.user)
}
