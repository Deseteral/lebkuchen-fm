package xyz.lebkuchenfm.external.gemini

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.accept
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

private val logger = KotlinLogging.logger {}

class GeminiClient(config: ApplicationConfig) {
    private val httpClient: HttpClient by lazy { prepareHttpClient() }

    private val apiKey: String? by lazy {
        config.propertyOrNull("${CONFIGURATION_KEY}.apiKey")?.getString()
    }
    private val model: String by lazy {
        config.property("${CONFIGURATION_KEY}.model").getString()
    }

    suspend fun generateText(prompt: String, systemPrompt: String): Result<String, GeminiGenerateTextError> {
        apiKey ?: run {
            logger.error { "Missing Google Gemini API key." }
            return Err(GeminiGenerateTextError.ApiKeyMissing)
        }

        val requestBody = GenerateTextRequestBody(
            systemInstruction = GenerateTextRequestBody.Content(
                parts = listOf(GenerateTextRequestBody.Content.Part(systemPrompt)),
            ),
            contents = GenerateTextRequestBody.Content(
                parts = listOf(GenerateTextRequestBody.Content.Part(prompt)),
            ),
            safetySettings = getSafetySettings(),
        )

        val response = httpClient.post("v1beta/models/$model:generateContent") {
            setBody(requestBody)
            contentType(ContentType.Application.Json)
            accept(ContentType.Application.Json)
        }

        if (!response.status.isSuccess()) {
            val error = response.bodyAsText()
            logger.error { error }
            return Err(GeminiGenerateTextError.GeminiError)
        }

        val responseBody: GenerateTextResponseBody = response.body()
        val responseText = responseBody.generatedTextContent
            ?: return Err(GeminiGenerateTextError.GeminiError)

        return Ok(responseText)
    }

    private fun prepareHttpClient(): HttpClient = HttpClient(OkHttp) {
        install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
        install(DefaultRequest) {
            url {
                protocol = URLProtocol.HTTPS
                host = "generativelanguage.googleapis.com"
                apiKey?.let {
                    parameters.append("key", it)
                }
            }
        }
    }

    private fun getSafetySettings(): List<GenerateTextRequestBody.SafetySetting> = listOf(
        GenerateTextRequestBody.SafetySetting("HARM_CATEGORY_HARASSMENT", "BLOCK_NONE"),
        GenerateTextRequestBody.SafetySetting("HARM_CATEGORY_HATE_SPEECH", "BLOCK_NONE"),
        GenerateTextRequestBody.SafetySetting("HARM_CATEGORY_SEXUALLY_EXPLICIT", "BLOCK_NONE"),
        GenerateTextRequestBody.SafetySetting("HARM_CATEGORY_DANGEROUS_CONTENT", "BLOCK_NONE"),
        GenerateTextRequestBody.SafetySetting("HARM_CATEGORY_CIVIC_INTEGRITY", "BLOCK_NONE"),
    )

    companion object {
        private const val CONFIGURATION_KEY = "radioPersonality.llm.gemini"
    }
}

sealed class GeminiGenerateTextError {
    data object ApiKeyMissing : GeminiGenerateTextError()
    data object GeminiError : GeminiGenerateTextError()
}

@Serializable
private data class GenerateTextRequestBody(
    @SerialName("system_instruction") val systemInstruction: Content,
    val contents: Content,
    val safetySettings: List<SafetySetting>,
) {
    @Serializable
    data class Content(
        val parts: List<Part>,
    ) {
        @Serializable
        data class Part(val text: String)
    }

    @Serializable
    data class SafetySetting(val category: String, val threshold: String)
}

@Serializable
private data class GenerateTextResponseBody(
    val candidates: List<Candidate>,
) {
    val generatedTextContent: String?
        get() = candidates.firstOrNull()?.content?.parts?.joinToString(" ") { it.text }

    @Serializable
    data class Candidate(
        val content: Content,
    ) {
        @Serializable
        data class Content(
            val parts: List<Part>,
        ) {
            @Serializable
            data class Part(val text: String)
        }
    }
}
