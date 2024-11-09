package xyz.lebkuchenfm.domain.songs

interface YouTubeRepository {
    suspend fun findSongNameByYoutubeId(youtubeId: String): String?
}
