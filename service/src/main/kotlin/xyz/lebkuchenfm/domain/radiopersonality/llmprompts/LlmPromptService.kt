package xyz.lebkuchenfm.domain.radiopersonality.llmprompts

class LlmPromptService(
    private val personalityPromptsRepository: LlmPersonalityPromptsRepository,
    private val situationPromptsRepository: LlmSituationPromptsRepository,
) {
    suspend fun getFullPromptTextForSituationUsingRandomPersonality(situationType: LlmSituationType): String? {
        val personalityPromptText = personalityPromptsRepository.findLatestActiveGroupedByName()
            .randomOrNull()
            ?.text
            ?: return null

        val situationPromptText = situationPromptsRepository.findLatestByType(situationType)
            ?.text
            ?: return null

        val fullPrompt = buildString {
            append(personalityPromptText)
            append(situationPromptText)
        }

        return fullPrompt
    }
}
