package xyz.lebkuchenfm.domain.radiopersonality.llmprompts

interface LlmPersonalityPromptsRepository {
    fun findLatestActiveGroupedByName(): List<LlmPersonalityPrompt>
}
