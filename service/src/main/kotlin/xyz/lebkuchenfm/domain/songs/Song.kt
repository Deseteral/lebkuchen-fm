package xyz.lebkuchenfm.domain.songs

import xyz.lebkuchenfm.domain.youtube.YoutubeVideoId

data class Song(
    val name: String,
    val youtubeId: YoutubeVideoId,
    val timesPlayed: Int,
    val trimStartSeconds: Int?,
    val trimEndSeconds: Int?,
)
