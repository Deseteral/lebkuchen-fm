package xyz.lebkuchenfm.external.gcptts

import com.github.michaelbull.result.getOr
import xyz.lebkuchenfm.domain.radiopersonality.tts.Base64EncodedAudio
import xyz.lebkuchenfm.domain.radiopersonality.tts.TextToSpeechProvider

class GoogleCloudPlatformTextToSpeech(
    private val gcpClient: GoogleCloudPlatformTextToSpeechClient,
) : TextToSpeechProvider {
    override suspend fun synthesize(text: String): Base64EncodedAudio? {
        return gcpClient.textSynthesize(text).getOr(null)
    }
}
