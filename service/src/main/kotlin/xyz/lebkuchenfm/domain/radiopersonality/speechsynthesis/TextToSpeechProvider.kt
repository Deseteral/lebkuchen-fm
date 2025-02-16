package xyz.lebkuchenfm.domain.radiopersonality.speechsynthesis

interface TextToSpeechProvider {
    suspend fun synthesize(text: String): Base64EncodedAudio?
}

data class Base64EncodedAudio(val audioContent: String, val format: String)
