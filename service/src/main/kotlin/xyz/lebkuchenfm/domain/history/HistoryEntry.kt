package xyz.lebkuchenfm.domain.history

import kotlinx.datetime.Instant
import xyz.lebkuchenfm.domain.youtube.YoutubeVideoId

data class HistoryEntry(
    val date: Instant,
    val youtubeId: YoutubeVideoId,
    // TODO: This should be a User object instead.
    val user: String?,
)
