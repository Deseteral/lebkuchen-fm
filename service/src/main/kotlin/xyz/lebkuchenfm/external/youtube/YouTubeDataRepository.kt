package xyz.lebkuchenfm.external.youtube

import com.github.michaelbull.result.get
import xyz.lebkuchenfm.domain.youtube.YouTubeRepository
import xyz.lebkuchenfm.domain.youtube.YoutubeVideo

class YouTubeDataRepository(private val youtubeClient: YoutubeClient) : YouTubeRepository {
    override suspend fun findVideoById(youtubeId: String): YoutubeVideo? {
        val name = youtubeClient.getVideoName(youtubeId).get() ?: return null
        return YoutubeVideo(youtubeId, name)
    }
}
