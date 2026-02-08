package xyz.lebkuchenfm.domain.history

import xyz.lebkuchenfm.domain.youtube.YoutubeVideoId
import kotlin.time.Instant

data class HistoryEntry(
    val date: Instant,
    val youtubeId: YoutubeVideoId,
    // TODO: This should be a User object instead.
    val user: String?,
)
