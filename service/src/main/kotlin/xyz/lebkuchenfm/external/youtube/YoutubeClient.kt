package xyz.lebkuchenfm.external.youtube

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.client.request.parameter
import io.ktor.http.parameters
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.config.ApplicationConfig
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

class YoutubeClient(config: ApplicationConfig) {
    private val youtubeClient: HttpClient by lazy { prepareHttpClient() }
    private val apiKey: String? by lazy { config.propertyOrNull("youtube.apiKey")?.getString() }

    suspend fun getVideoName(id: String): String {
        val response: YoutubeVideosResponse = youtubeClient.get("/videos") {
            parameters {
                parameter("id", id)
                parameter("part", "snippet")
                parameter("filer", "id")
            }
        }.body()

        val video = response.items.first()
        return video.snippet.title
    }

    private fun prepareHttpClient(): HttpClient {
        return HttpClient(OkHttp) {
            install(YoutubeHttpClientPlugin) {
                apiKey = this@YoutubeClient.apiKey
            }
            install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
        }
    }
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
