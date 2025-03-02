package xyz.lebkuchenfm.domain.radiopersonality.llmprompts

import io.github.oshai.kotlinlogging.KotlinLogging

private val logger = KotlinLogging.logger {}

class LlmPromptService(
    private val personalityPromptsRepository: LlmPersonalityPromptsRepository,
    private val situationPromptsRepository: LlmSituationPromptsRepository,
) {
    suspend fun getFullPromptTextForSituationUsingRandomPersonality(situationType: LlmSituationType): LlmPromptRaw? {
        val personalityPromptText = personalityPromptsRepository.findLatestActiveGroupedByName()
            .randomOrNull()
            ?.text
            ?: run {
                logger.info { "No active personality prompts found." }
                return null
            }

        val situationPromptText = situationPromptsRepository.findLatestByType(situationType)
            ?.text
            ?: run {
                logger.info { "No situation prompt found for type $situationType." }
                return null
            }

        return LlmPromptRaw(
            systemPrompt = personalityPromptText,
            prompt = situationPromptText,
        )
    }
}
