package xyz.lebkuchenfm.external.gemini

import xyz.lebkuchenfm.domain.radiopersonality.RadioPersonalityBrain
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmPromptRaw

class GeminiRadioPersonality : RadioPersonalityBrain {
    override fun generateTextForPrompt(prompt: LlmPromptRaw): String? {
        TODO("Will be implemented in next Pull Request.")
    }
}
