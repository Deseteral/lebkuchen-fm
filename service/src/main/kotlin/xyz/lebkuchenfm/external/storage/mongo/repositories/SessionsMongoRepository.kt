package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.mongodb.client.model.Filters
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.FindOneAndUpdateOptions
import com.mongodb.client.model.IndexOptions
import com.mongodb.client.model.Indexes
import com.mongodb.client.model.ReturnDocument
import com.mongodb.client.model.Updates
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.toList
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import org.bson.BsonDateTime
import xyz.lebkuchenfm.domain.sessions.SessionsRepository
import java.util.concurrent.TimeUnit
import kotlin.time.Duration.Companion.days

class SessionsMongoRepository(database: MongoDatabase, private val clock: Clock) : SessionsRepository {
    private val collection = database.getCollection<SessionsEntity>("sessions")

    suspend fun createExpirationIndex() {
        collection.updateMany(
            Filters.exists(SessionsEntity::expireAt.name, false),
            Updates.set(SessionsEntity::expireAt.name, BsonDateTime(clock.now().toEpochMilliseconds())),
        )
        collection.createIndex(
            Indexes.ascending(SessionsEntity::expireAt.name),
            IndexOptions().expireAfter(0, TimeUnit.SECONDS),
        )
    }

    suspend fun createUniqueIndex() {
        collection.createIndex(
            Indexes.ascending(SessionsEntity::sessionId.name),
            IndexOptions().unique(true),
        )
    }

    override suspend fun upsert(sessionId: String, userId: String, cookieValue: String): String? {
        return collection.findOneAndUpdate(
            eq(SessionsEntity::sessionId.name, sessionId),
            Updates.combine(
                Updates.set(SessionsEntity::value.name, cookieValue),
                Updates.set(SessionsEntity::userId.name, userId),
                Updates.set(SessionsEntity::expireAt.name, sevenDaysFromNow),
            ),
            FindOneAndUpdateOptions().upsert(true).returnDocument(ReturnDocument.AFTER),
        )?.value
    }

    override suspend fun findBySessionId(sessionId: String): String? {
        val slideExpiration = Updates.set(SessionsEntity::expireAt.name, sevenDaysFromNow)
        val session = collection.findOneAndUpdate(
            eq(SessionsEntity::sessionId.name, sessionId),
            slideExpiration,
            FindOneAndUpdateOptions().upsert(false).returnDocument(ReturnDocument.AFTER),
        )
        return session?.value
    }

    override suspend fun findSessionIdsByUserId(userId: String): List<String> {
        return collection.find(eq(SessionsEntity::userId.name, userId)).toList().map { it.sessionId }
    }

    override suspend fun remove(sessionId: String) {
        collection.deleteOne(eq(SessionsEntity::sessionId.name, sessionId))
    }

    override suspend fun removeAllByUserId(userId: String) {
        collection.deleteMany(eq(SessionsEntity::userId.name, userId))
    }

    private val sevenDaysFromNow: BsonDateTime get() = BsonDateTime((clock.now() + 7.days).toEpochMilliseconds())
}

@Serializable
private data class SessionsEntity(
    val sessionId: String,
    val value: String,
    val userId: String?,
    @Contextual val expireAt: Instant,
)
