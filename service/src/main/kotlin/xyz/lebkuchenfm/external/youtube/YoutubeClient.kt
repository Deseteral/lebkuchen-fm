package xyz.lebkuchenfm.external.youtube

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.client.request.parameter
import io.ktor.client.statement.request
import io.ktor.http.HttpStatusCode
import io.ktor.http.URLProtocol
import io.ktor.http.parameters
import io.ktor.http.path
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.config.ApplicationConfig
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

private val logger = KotlinLogging.logger {}

class YoutubeClient(config: ApplicationConfig) {
    private val youtubeClient: HttpClient by lazy { prepareHttpClient() }
    private val apiKey: String? by lazy { config.propertyOrNull("youtube.apiKey")?.getString() }

    suspend fun getVideoName(id: String): Result<String, YoutubeClientError> {
        if (apiKey == null) {
            logger.warn { "Missing Youtube API key." }
            return Err(YoutubeClientError.ApiKeyMissing)
        }

        val response = youtubeClient.get("videos") {
            parameters {
                parameter("id", id)
                parameter("part", "snippet")
                parameter("filer", "id")
            }
        }

        if (response.status != HttpStatusCode.OK) {
            logger.error { "YoutubeClient failed with status: ${response.status} \n ${response.request.url}." }
            return Err(YoutubeClientError.UnknownError)
        }

        val responseBody: YoutubeVideosResponse = response.body()

        return when (val video = responseBody.items.firstOrNull()) {
            is YoutubeVideo -> Ok(video.snippet.title)
            else -> Err(YoutubeClientError.VideoNotFound)
        }
    }

    private fun prepareHttpClient(): HttpClient {
        return HttpClient(OkHttp) {
            install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
            install(DefaultRequest) {
                url {
                    protocol = URLProtocol.HTTPS
                    host = "www.googleapis.com"
                    path("/youtube/v3/")
                    this@YoutubeClient.apiKey?.let { parameters.append("key", it) }
                }
            }
        }
    }
}

sealed interface YoutubeClientError {
    data object ApiKeyMissing : YoutubeClientError
    data object VideoNotFound : YoutubeClientError
    data object UnknownError : YoutubeClientError
}

@Serializable
data class YoutubeVideosResponse(val items: List<YoutubeVideo>)

@Serializable
data class YoutubeVideo(
    val id: String,
    val snippet: YouTubeVideoSnippet,
)

@Serializable
data class YouTubeVideoSnippet(
    val title: String,
    val description: String,
)
