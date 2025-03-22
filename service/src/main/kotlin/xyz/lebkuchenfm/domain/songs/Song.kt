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

data class SongWithVideoStream(
    val song: Song,
    val videoStream: VideoStream,
) {
    data class VideoStream(
        val url: Url,
    )
}
