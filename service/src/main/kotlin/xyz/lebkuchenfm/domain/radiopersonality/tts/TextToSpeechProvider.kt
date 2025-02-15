package xyz.lebkuchenfm.domain.radiopersonality.tts

data class Base64EncodedAudio(val audioContent: String, val format: String)

interface TextToSpeechProvider {
    suspend fun synthesize(text: String): Base64EncodedAudio?
}
