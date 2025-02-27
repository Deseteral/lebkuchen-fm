package xyz.lebkuchenfm.domain.radiopersonality.llmprompts

interface LlmSituationPromptsRepository {
    fun findLatestByType(type: LlmSituationType): LlmSituationPrompt?
}
