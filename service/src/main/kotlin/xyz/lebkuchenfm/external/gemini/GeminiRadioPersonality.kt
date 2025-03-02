package xyz.lebkuchenfm.external.gemini

import xyz.lebkuchenfm.domain.radiopersonality.RadioPersonalityBrainProvider
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmPromptRaw

class GeminiRadioPersonality : RadioPersonalityBrainProvider {
    override fun generateTextForPrompt(prompt: LlmPromptRaw): String? {
        TODO("Will be implemented in next Pull Request.")
    }
}
