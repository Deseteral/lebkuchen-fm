package xyz.lebkuchenfm.external.youtube

import com.github.michaelbull.result.get
import xyz.lebkuchenfm.domain.youtube.YouTubeRepository
import xyz.lebkuchenfm.domain.youtube.YoutubeVideo
import xyz.lebkuchenfm.domain.youtube.YoutubeVideoId

class YouTubeDataRepository(private val youtubeClient: YoutubeClient) : YouTubeRepository {
    override suspend fun findVideoById(youtubeId: YoutubeVideoId): YoutubeVideo? {
        return youtubeClient.getVideoName(youtubeId.value).get()?.let { YoutubeVideo(youtubeId, it) }
    }

    override suspend fun findVideoByPhrase(phrase: String): YoutubeVideo? {
        return youtubeClient.findVideo(phrase).get()?.let { YoutubeVideo(YoutubeVideoId(it.id), it.snippet.title) }
    }

    override suspend fun findVideosByPlaylistId(playlistId: String): List<YoutubeVideo> {
        return youtubeClient.getPlaylistVideos(playlistId).get()
            ?.map { YoutubeVideo(YoutubeVideoId(it.id), it.snippet.title) }
            ?: emptyList()
    }
}
