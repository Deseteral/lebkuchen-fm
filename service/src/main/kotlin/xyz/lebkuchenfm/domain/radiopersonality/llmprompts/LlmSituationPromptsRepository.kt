package xyz.lebkuchenfm.domain.radiopersonality.llmprompts

interface LlmSituationPromptsRepository {
    suspend fun findLatestByType(type: LlmSituationType): LlmSituationPrompt?
}
