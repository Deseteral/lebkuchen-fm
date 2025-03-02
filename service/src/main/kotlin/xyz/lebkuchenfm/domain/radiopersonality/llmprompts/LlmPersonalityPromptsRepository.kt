package xyz.lebkuchenfm.domain.radiopersonality.llmprompts

interface LlmPersonalityPromptsRepository {
    suspend fun findLatestActiveGroupedByName(): List<LlmPersonalityPrompt>
}
