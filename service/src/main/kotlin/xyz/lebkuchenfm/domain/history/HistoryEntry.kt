package xyz.lebkuchenfm.domain.history

import kotlinx.datetime.Instant

data class HistoryEntry(
    val date: Instant,
    val youtubeId: String,
    // TODO: This should be a User object instead.
    val user: String?,
)
