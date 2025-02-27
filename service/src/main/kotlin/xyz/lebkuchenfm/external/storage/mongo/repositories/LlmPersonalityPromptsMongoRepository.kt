package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.mongodb.kotlin.client.coroutine.MongoDatabase
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmPersonalityPrompt
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmPersonalityPromptsRepository

class LlmPersonalityPromptsMongoRepository(database: MongoDatabase): LlmPersonalityPromptsRepository {
    private val collection = database.getCollection<LlmPersonalityPromptEntity>("llmPersonalityPrompts")

    override fun findLatestActiveGroupedByName(): List<LlmPersonalityPrompt> {
        TODO("Not yet implemented")
    }
}

private data class LlmPersonalityPromptEntity(val text: String)
