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
import xyz.lebkuchenfm.external.youtube.YoutubeSearchResponse.YoutubeSearchItem

private val logger = KotlinLogging.logger {}

class YoutubeClient(config: ApplicationConfig) {
    private val youtubeClient: HttpClient by lazy { prepareHttpClient() }
    private val apiKey: String? by lazy { config.propertyOrNull("youtube.apiKey")?.getString() }

    suspend fun getVideoName(id: String): Result<String, YoutubeClientError> {
        apiKey ?: run {
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

    suspend fun findVideo(phrase: String): Result<YoutubeVideo, YoutubeClientError> {
        apiKey ?: run {
            logger.warn { "Missing Youtube API key." }
            return Err(YoutubeClientError.ApiKeyMissing)
        }

        val response = youtubeClient.get("search") {
            parameters {
                parameter("q", phrase)
                parameter("maxResults", 1.toString())
                parameter("part", "snippet")
                parameter("type", "video")
                parameter("safeSearch", "none")
                parameter("videoEmbeddable", "true")
            }
        }

        if (response.status != HttpStatusCode.OK) {
            logger.error { "YoutubeClient failed with status: ${response.status} \n ${response.request.url}." }
            return Err(YoutubeClientError.UnknownError)
        }

        val responseBody: YoutubeSearchResponse = response.body()

        return when (val item = responseBody.items.firstOrNull()) {
            is YoutubeSearchItem -> Ok(YoutubeVideo(item.id.videoId, item.snippet))
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

sealed class YoutubeClientError {
    data object ApiKeyMissing : YoutubeClientError()
    data object VideoNotFound : YoutubeClientError()
    data object UnknownError : YoutubeClientError()
}

@Serializable
data class YoutubeVideosResponse(val items: List<YoutubeVideo>)

@Serializable
data class YoutubeSearchResponse(val items: List<YoutubeSearchItem>) {
    @Serializable
    data class YoutubeSearchItem(
        val id: Id,
        val snippet: YouTubeVideoSnippet,
    ) {
        @Serializable
        data class Id(val videoId: String)
    }
}

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
