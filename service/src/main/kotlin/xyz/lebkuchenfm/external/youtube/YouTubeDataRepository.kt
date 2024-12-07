package xyz.lebkuchenfm.external.youtube

import com.github.michaelbull.result.get
import xyz.lebkuchenfm.domain.youtube.YouTubeRepository
import xyz.lebkuchenfm.domain.youtube.YoutubeVideo

class YouTubeDataRepository(private val youtubeClient: YoutubeClient) : YouTubeRepository {
    override suspend fun findVideoById(youtubeId: String): YoutubeVideo? {
        return youtubeClient.getVideoName(youtubeId).get()?.let { YoutubeVideo(youtubeId, it) }
    }

    override suspend fun findVideoByPhrase(phrase: String): YoutubeVideo? {
        return youtubeClient.findVideo(phrase).get()?.let { YoutubeVideo(it.id, it.snippet.title) }
    }
}
