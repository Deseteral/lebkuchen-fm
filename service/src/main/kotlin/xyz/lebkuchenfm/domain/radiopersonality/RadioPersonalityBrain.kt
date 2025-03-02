package xyz.lebkuchenfm.domain.radiopersonality

import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmPromptRaw

interface RadioPersonalityBrain {
    fun generateTextForPrompt(prompt: LlmPromptRaw): String?
}
