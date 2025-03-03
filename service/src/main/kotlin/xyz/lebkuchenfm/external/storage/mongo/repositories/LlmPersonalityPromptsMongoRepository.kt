package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.mongodb.client.model.Accumulators
import com.mongodb.client.model.Aggregates
import com.mongodb.client.model.Filters
import com.mongodb.client.model.Sorts
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmPersonalityPrompt
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmPersonalityPromptsRepository
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmPromptCreation
import xyz.lebkuchenfm.domain.users.UserName

class LlmPersonalityPromptsMongoRepository(database: MongoDatabase) : LlmPersonalityPromptsRepository {
    private val collection = database.getCollection<LlmPersonalityPromptEntity>("llmPersonalityPrompts")

    override suspend fun findLatestActiveGroupedByName(): List<LlmPersonalityPrompt> {
        val pipeline = listOf(
            Aggregates.match(Filters.eq(LlmPersonalityPromptEntity::active.name, true)),
            Aggregates.sort(Sorts.descending(LlmPersonalityPromptEntity::createdAt.name)),
            Aggregates.group("\$name", Accumulators.first("latestDocument", "\$\$ROOT")),
            Aggregates.replaceRoot("\$latestDocument"),
        )

        return collection.aggregate(pipeline).map { it.toDomain() }.toList()
    }
}

@Serializable
private data class LlmPersonalityPromptEntity(
    val text: String,
    val name: String,
    val active: Boolean,
    @Contextual val createdAt: Instant,
    val createdBy: String,
) {
    fun toDomain() = LlmPersonalityPrompt(
        text = text,
        name = name,
        active = active,
        created = LlmPromptCreation(
            at = createdAt,
            by = UserName(createdBy),
        ),
    )
}
