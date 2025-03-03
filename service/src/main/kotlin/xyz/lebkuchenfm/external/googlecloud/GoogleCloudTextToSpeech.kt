package xyz.lebkuchenfm.external.googlecloud

import com.github.michaelbull.result.get
import xyz.lebkuchenfm.domain.radiopersonality.speechsynthesis.Base64EncodedAudio
import xyz.lebkuchenfm.domain.radiopersonality.speechsynthesis.TextToSpeechProvider

class GoogleCloudTextToSpeech(
    private val googleCloudTextToSpeechClient: GoogleCloudTextToSpeechClient,
) : TextToSpeechProvider {
    override suspend fun synthesize(text: String): Base64EncodedAudio? {
        return googleCloudTextToSpeechClient.textSynthesize(text).get()
    }
}
