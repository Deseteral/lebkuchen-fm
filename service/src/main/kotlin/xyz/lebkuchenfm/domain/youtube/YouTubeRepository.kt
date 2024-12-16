package xyz.lebkuchenfm.domain.youtube

interface YouTubeRepository {
    suspend fun findVideoById(youtubeId: YoutubeVideoId): YoutubeVideo?
    suspend fun findVideoByPhrase(phrase: String): YoutubeVideo?
    suspend fun findVideosByPlaylistId(playlistId: String): List<YoutubeVideo>
}
