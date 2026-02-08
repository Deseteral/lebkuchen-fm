package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.github.michaelbull.result.Result
import com.github.michaelbull.result.coroutines.runSuspendCatching
import com.github.michaelbull.result.map
import com.github.michaelbull.result.mapError
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.history.HistoryEntry
import xyz.lebkuchenfm.domain.history.HistoryRepository
import xyz.lebkuchenfm.domain.history.InsertHistoryEntryError
import kotlin.time.Instant

class HistoryMongoRepository(database: MongoDatabase) : HistoryRepository {
    private val collection = database.getCollection<HistoryEntity>("history")

    override suspend fun insert(history: HistoryEntry): Result<HistoryEntry, InsertHistoryEntryError> {
        return runSuspendCatching { collection.insertOne(history.toEntity()) }
            .map { history }
            .mapError { InsertHistoryEntryError.UnknownError }
    }
}

@Serializable
private data class HistoryEntity(
    @Contextual val date: Instant,
    val youtubeId: String,
    val user: String?,
)

private fun HistoryEntry.toEntity() = HistoryEntity(
    date = date,
    youtubeId = youtubeId.value,
    user = user,
)
