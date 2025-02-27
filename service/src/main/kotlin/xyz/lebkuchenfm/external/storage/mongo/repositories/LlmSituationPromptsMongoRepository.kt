package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Sorts
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import org.bson.types.ObjectId
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmPromptCreation
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmSituationPrompt
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmSituationPromptsRepository
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmSituationType
import xyz.lebkuchenfm.domain.users.UserName

class LlmSituationPromptsMongoRepository(database: MongoDatabase) : LlmSituationPromptsRepository {
    private val collection = database.getCollection<LlmSituationPromptEntity>("llmSituationPrompts")

    override suspend fun findLatestByType(type: LlmSituationType): LlmSituationPrompt? {
        return collection
            .find(eq(LlmSituationPromptEntity::type.name, type.name))
            .sort(Sorts.descending(LlmSituationPromptEntity::createdAt.name))
            .limit(1)
            .firstOrNull()
            ?.toDomain()
    }
}

@Serializable
private data class LlmSituationPromptEntity(
    @Contextual @SerialName("_id") val id: ObjectId? = null,
    val text: String,
    val type: String,
    @Contextual val createdAt: Instant,
    val createdBy: String,
) {
    fun toDomain() = LlmSituationPrompt(
        text = text,
        type = LlmSituationType.valueOf(type),
        created = LlmPromptCreation(
            at = createdAt,
            by = UserName(createdBy),
        ),
    )
}
