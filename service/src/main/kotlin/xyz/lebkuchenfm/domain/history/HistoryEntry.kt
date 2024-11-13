package xyz.lebkuchenfm.domain.history

import kotlinx.datetime.Instant

data class HistoryEntry(
    val date: Instant,
    val youtubeId: String,
    val user: String?,
)
