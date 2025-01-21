package xyz.lebkuchenfm.domain.youtube

@JvmInline
value class YoutubeVideoId(val value: String)

data class YoutubeVideo(
    val id: YoutubeVideoId,
    val name: String,
)
