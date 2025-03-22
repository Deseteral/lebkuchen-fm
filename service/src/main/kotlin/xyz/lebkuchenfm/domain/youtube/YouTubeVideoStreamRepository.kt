package xyz.lebkuchenfm.domain.youtube

interface YouTubeVideoStreamRepository {
    fun getVideoStreamUrl(youtubeId: YoutubeVideoId): String?
}
