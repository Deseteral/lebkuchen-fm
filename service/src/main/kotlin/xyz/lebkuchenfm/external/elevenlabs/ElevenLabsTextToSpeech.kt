package xyz.lebkuchenfm.external.elevenlabs

import com.github.michaelbull.result.get
import xyz.lebkuchenfm.domain.radiopersonality.speechsynthesis.Base64EncodedAudio
import xyz.lebkuchenfm.domain.radiopersonality.speechsynthesis.TextToSpeechProvider

class ElevenLabsTextToSpeech(
    private val elevenLabsClient: ElevenLabsClient,
) : TextToSpeechProvider {
    override suspend fun synthesize(text: String): Base64EncodedAudio? {
        return elevenLabsClient.textToSpeech(text).get()
    }
}
