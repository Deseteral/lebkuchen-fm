package xyz.lebkuchenfm.domain.radiopersonality.llmprompts

import kotlinx.datetime.Instant
import xyz.lebkuchenfm.domain.users.User

data class LlmPersonalityPrompt(
    val text: String,
    val name: String,
    val enabled: Boolean,
    val created: LlmPromptCreation,
)

data class LlmSituationPrompt(
    val text: String,
    val type: LlmSituationType,
    val created: LlmPromptCreation,
) {
    enum class LlmSituationType {
        SONG_STARTED_PLAYING,
        LISTENER_CALLING,
    }
}

data class LlmPromptCreation(
    val on: Instant,
    val by: User,
)
