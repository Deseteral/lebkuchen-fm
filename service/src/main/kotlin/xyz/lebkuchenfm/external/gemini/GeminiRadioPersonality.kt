package xyz.lebkuchenfm.external.gemini

import com.github.michaelbull.result.get
import xyz.lebkuchenfm.domain.radiopersonality.RadioPersonalityBrain
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmPromptRaw

class GeminiRadioPersonality(private val geminiClient: GeminiClient) : RadioPersonalityBrain {
    override suspend fun generateTextForPrompt(prompt: LlmPromptRaw): String? {
        return geminiClient.generateText(prompt).get()
    }
}
