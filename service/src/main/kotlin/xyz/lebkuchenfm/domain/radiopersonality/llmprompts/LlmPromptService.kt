package xyz.lebkuchenfm.domain.radiopersonality.llmprompts

class LlmPromptService {
    fun getFullPromptTextForSituationUsingRandomPersonality(situationType: LlmSituationType): String? {
        val personalityPromptText = getAllLatestActivePersonalityPrompts()
            .randomOrNull()
            ?.text
            ?: return null

        val situationPromptText = getLatestPromptTextForSituationType(situationType)
            ?: return null

        val fullPrompt = buildString {
            append(personalityPromptText)
            append(situationPromptText)
        }

        return fullPrompt
    }

    private fun getAllLatestActivePersonalityPrompts(): List<LlmPersonalityPrompt> {
        // Find all latest personality prompts.

        // Filter only active personalities.

        return emptyList() // TODO: Implement.
    }

    private fun getLatestPromptTextForSituationType(situationType: LlmSituationType): String? {
        return null // TODO: Implement.
    }
}
