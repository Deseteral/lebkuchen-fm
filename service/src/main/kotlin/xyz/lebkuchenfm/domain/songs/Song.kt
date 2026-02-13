package xyz.lebkuchenfm.domain.songs

import io.ktor.http.Url
import xyz.lebkuchenfm.domain.youtube.YoutubeVideoId

data class Song(
    val name: String,
    val youtubeId: YoutubeVideoId,
    val timesPlayed: Int,
    val trimStartSeconds: Int?,
    val trimEndSeconds: Int?,
)

data class SongWithStream(
    val song: Song,
    val stream: Stream,
) {
    data class Stream(
        val url: Url,
    )
}
