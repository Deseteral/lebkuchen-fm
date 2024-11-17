package xyz.lebkuchenfm.domain.songs

data class Song(
    val name: String,
    val youtubeId: String,
    val timesPlayed: Int,
    val trimStartSeconds: Int?,
    val trimEndSeconds: Int?,
)
