package xyz.lebkuchenfm.domain.radiopersonality

import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmPromptRaw

interface RadioPersonalityBrainProvider {
    fun generateTextForPrompt(prompt: LlmPromptRaw): String?
}
