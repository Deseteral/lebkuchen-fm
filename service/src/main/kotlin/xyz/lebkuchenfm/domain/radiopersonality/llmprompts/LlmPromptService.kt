package xyz.lebkuchenfm.domain.radiopersonality.llmprompts

class LlmPromptService(
    private val personalityPromptsRepository: LlmPersonalityPromptsRepository,
    private val situationPromptsRepository: LlmSituationPromptsRepository,
) {
    fun getFullPromptTextForSituationUsingRandomPersonality(situationType: LlmSituationType): String? {
        val personalityPromptText = personalityPromptsRepository.findLatestActiveGroupedByName()
            .randomOrNull()
            ?.text
            ?: return null

        val situationPromptText = situationPromptsRepository.findLatestByType(situationType)
            ?: return null

        val fullPrompt = buildString {
            append(personalityPromptText)
            append(situationPromptText)
        }

        return fullPrompt
    }
}
