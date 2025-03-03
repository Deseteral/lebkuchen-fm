package xyz.lebkuchenfm.domain.radiopersonality

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmPromptRaw
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmPromptService
import xyz.lebkuchenfm.domain.radiopersonality.llmprompts.LlmSituationType
import xyz.lebkuchenfm.domain.radiopersonality.speechsynthesis.Base64EncodedAudio
import xyz.lebkuchenfm.domain.radiopersonality.speechsynthesis.TextToSpeechProvider

private val logger = KotlinLogging.logger {}

class RadioPersonalityService(
    private val llmPromptService: LlmPromptService,
    private val radioPersonalityBrain: RadioPersonalityBrain,
    private val textToSpeechProvider: TextToSpeechProvider,
) {
    suspend fun onListenerCalling(userMessage: String): RadioPersonalityUtterance? {
        val situationType = LlmSituationType.LISTENER_CALLING
        val prompt = llmPromptService
            .getRawPromptForGivenSituationWithRandomPersonality(situationType)
            ?.applyVariable(LlmPromptRaw.PromptVariables.LISTENER_MESSAGE, userMessage)
            ?: run {
                logger.error { "No prompt found for situation type $situationType." }
                return null
            }

        val text = radioPersonalityBrain.generateTextForPrompt(prompt)
            ?: run {
                logger.error { "Could not generate the text for given prompt." }
                return null
            }

        val audio = textToSpeechProvider.synthesize(text)
            ?: run {
                logger.error { "Could not synthesize the text to audio." }
                return null
            }

        return RadioPersonalityUtterance(text, audio)
    }

    suspend fun userControlledUtterance(userMessage: String): RadioPersonalityUtterance? {
        val audio = textToSpeechProvider.synthesize(userMessage)
            ?: run {
                logger.error { "Could not synthesize the text to audio." }
                return null
            }

        return RadioPersonalityUtterance(userMessage, audio)
    }
}

data class RadioPersonalityUtterance(
    val text: String,
    val audio: Base64EncodedAudio,
)
