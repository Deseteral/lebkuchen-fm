package xyz.lebkuchenfm.external.gcptts

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import dev.kord.rest.request.errorString
import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.accept
import io.ktor.client.request.headers
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.URLProtocol
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import io.ktor.http.path
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.config.ApplicationConfig
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import xyz.lebkuchenfm.domain.radiopersonality.tts.Base64EncodedAudio

private val logger = KotlinLogging.logger {}

class GoogleCloudPlatformTextToSpeechClient(config: ApplicationConfig) {
    private val httpClient: HttpClient by lazy { prepareHttpClient() }
    private val apiKey: String? by lazy {
        config.propertyOrNull("radioPersonality.textToSpeech.gcp.apiKey")?.getString()
    }
    private val languageCode: String by lazy {
        config.property("radioPersonality.textToSpeech.gcp.languageCode").getString()
    }
    private val voiceGender: String by lazy {
        config.property("radioPersonality.textToSpeech.gcp.voiceGender").getString()
    }

    suspend fun textSynthesize(text: String): Result<Base64EncodedAudio, GCPTextSynthesiseError> {
        apiKey ?: run {
            logger.error { "Missing Google Cloud Platform API key." }
            return Err(GCPTextSynthesiseError.ApiKeyMissing)
        }

        val requestBody = TextSynthesizeRequestBody(
            input = TextSynthesizeRequestBody.SynthesisInput(text),
            voice = TextSynthesizeRequestBody.VoiceSelectionParams(languageCode, voiceGender),
            audioConfig = TextSynthesizeRequestBody.AudioConfig("MP3"),
        )

        val response = httpClient.post("text:synthesize") {
            setBody(requestBody)
            contentType(ContentType.Application.Json)
            accept(ContentType.Application.Json)
        }

        if (!response.status.isSuccess()) {
            val error = response.errorString()
            logger.error { error }
            return Err(GCPTextSynthesiseError.GoogleCloudPlatformError)
        }

        val responseBody: TextSynthesizeResponseBody = response.body()

        return Ok(Base64EncodedAudio(responseBody.audioContent, "mp3"))
    }

    private fun prepareHttpClient(): HttpClient {
        return HttpClient(OkHttp) {
            install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
            install(DefaultRequest) {
                url {
                    protocol = URLProtocol.HTTPS
                    host = "texttospeech.googleapis.com"
                    path("/v1/")
                }
                headers {
                    this@GoogleCloudPlatformTextToSpeechClient.apiKey?.let {
                        append("X-Goog-Api-Key", it)
                    }
                }
            }
        }
    }
}

sealed class GCPTextSynthesiseError {
    data object ApiKeyMissing : GCPTextSynthesiseError()
    data object GoogleCloudPlatformError : GCPTextSynthesiseError()
}

@Serializable
private data class TextSynthesizeRequestBody(
    val input: SynthesisInput,
    val voice: VoiceSelectionParams,
    val audioConfig: AudioConfig,
) {
    @Serializable
    data class SynthesisInput(val text: String)

    @Serializable
    data class VoiceSelectionParams(
        val languageCode: String,
        val ssmlGender: String,
    )

    @Serializable
    data class AudioConfig(val audioEncoding: String)
}

@Serializable
private data class TextSynthesizeResponseBody(val audioContent: String)
