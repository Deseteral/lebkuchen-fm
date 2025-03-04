package xyz.lebkuchenfm.external.elevenlabs

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.headers
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.URLProtocol
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.config.ApplicationConfig
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import xyz.lebkuchenfm.domain.radiopersonality.speechsynthesis.Base64EncodedAudio
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

private val logger = KotlinLogging.logger {}

class ElevenLabsClient(config: ApplicationConfig) {
    private val httpClient: HttpClient by lazy { prepareHttpClient() }

    private val apiKey: String? by lazy {
        config.propertyOrNull("$CONFIGURATION_KEY.apiKey")?.getString()
    }

    @OptIn(ExperimentalEncodingApi::class)
    suspend fun textToSpeech(text: String): Result<Base64EncodedAudio, ElevenLabsTextToSpeechError> {
        apiKey ?: run {
            logger.error { "Missing Eleven Labs API key." }
            return Err(ElevenLabsTextToSpeechError.ApiKeyMissing)
        }

        val requestBody = TextSynthesizeRequestBody(
            text,
            "eleven_multilingual_v2"
        )
        val voiceId = "Xb7hH8MSUJpSbSDYk0k2"
        val format = "mp3_44100_128"

        val response = httpClient.post("text-to-speech/$voiceId?output_format=$format") {
            setBody(requestBody)
            contentType(ContentType.Application.Json)
        }

        if (!response.status.isSuccess()) {
            val error = response.bodyAsText()
            logger.error { error }
            return Err(ElevenLabsTextToSpeechError.ElevenLabsError)
        }

        val audioBytes = response.body<ByteArray>()
        val base64 = Base64.encode(audioBytes)

        return Ok(Base64EncodedAudio(base64, "mp3"))
    }

    private fun prepareHttpClient(): HttpClient = HttpClient(OkHttp) {
        install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
        install(DefaultRequest) {
            url {
                protocol = URLProtocol.HTTPS
                host = "api.elevenlabs.io/v1"
            }
            headers {
                apiKey?.let {
                    append("xi-api-key", it)
                }
            }
        }
    }

    companion object {
        private const val CONFIGURATION_KEY = "radioPersonality.textToSpeech.elevenLabs"
    }
}

sealed class ElevenLabsTextToSpeechError {
    data object ApiKeyMissing : ElevenLabsTextToSpeechError()
    data object ElevenLabsError : ElevenLabsTextToSpeechError()
}

@Serializable
private data class TextSynthesizeRequestBody(
    val text: String,
    @SerialName("model_id") val modelId: String,
)
