package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.mongodb.kotlin.client.coroutine.MongoDatabase
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmSituationPrompt
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmSituationPromptsRepository
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmSituationType

class LlmSituationPromptsMongoRepository(database: MongoDatabase) : LlmSituationPromptsRepository {
    private val collection = database.getCollection<LlmSituationPromptEntity>("llmSituationPrompts")

    override fun findLatestByType(type: LlmSituationType): LlmSituationPrompt? {
        TODO("Not yet implemented")
    }
}

private data class LlmSituationPromptEntity(val text: String)
