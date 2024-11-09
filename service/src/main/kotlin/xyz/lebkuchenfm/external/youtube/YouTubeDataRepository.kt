package xyz.lebkuchenfm.external.youtube

import com.github.michaelbull.result.get
import xyz.lebkuchenfm.domain.songs.YouTubeRepository

class YouTubeDataRepository(private val youtubeClient: YoutubeClient) : YouTubeRepository {
    override suspend fun findSongNameByYoutubeId(youtubeId: String): String? {
        return youtubeClient.getVideoName(youtubeId).get()
    }
}
