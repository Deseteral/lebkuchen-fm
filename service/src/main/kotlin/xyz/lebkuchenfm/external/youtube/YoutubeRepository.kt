package xyz.lebkuchenfm.external.youtube

import com.github.michaelbull.result.get
import xyz.lebkuchenfm.domain.songs.YoutubeSongsRepository

class YoutubeRepository(private val youtubeClient: YoutubeClient) : YoutubeSongsRepository {
    override suspend fun findSongNameByYoutubeId(youtubeId: String): String? {
        return youtubeClient.getVideoName(youtubeId).get()
    }
}
