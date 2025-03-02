package xyz.lebkuchenfm.domain.radiopersonality.llmprompts

import kotlinx.datetime.Instant
import xyz.lebkuchenfm.domain.users.UserName

data class LlmPersonalityPrompt(
    val text: String,
    val name: String,
    val active: Boolean,
    val created: LlmPromptCreation,
)

data class LlmSituationPrompt(
    val text: String,
    val type: LlmSituationType,
    val created: LlmPromptCreation,
)

enum class LlmSituationType {
    SONG_STARTED_PLAYING,
    LISTENER_CALLING,
}

data class LlmPromptCreation(
    val at: Instant,
    val by: UserName,
)

data class LlmPromptRaw(
    val systemPrompt: String,
    val prompt: String,
) {
    fun applyVariable(variable: PromptVariables, value: String): LlmPromptRaw {
        val variableText = "{{$variable}}"
        return copy(
            systemPrompt = systemPrompt.replace(variableText, value),
            prompt = prompt.replace(variableText, value),
        )
    }

    enum class PromptVariables {
        CURRENT_SONG_NAME,
        LISTENER_MESSAGE,
    }
}
