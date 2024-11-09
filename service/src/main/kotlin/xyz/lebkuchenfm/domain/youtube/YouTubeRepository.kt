package xyz.lebkuchenfm.domain.youtube

interface YouTubeRepository {
    suspend fun findVideoById(youtubeId: String): YoutubeVideo?
}