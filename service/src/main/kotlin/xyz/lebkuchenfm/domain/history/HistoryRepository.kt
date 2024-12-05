package xyz.lebkuchenfm.domain.history

import com.github.michaelbull.result.Result

interface HistoryRepository {
    suspend fun insert(history: HistoryEntry): Result<HistoryEntry, InsertHistoryEntryError>
}

sealed class InsertHistoryEntryError {
    data object UnknownError : InsertHistoryEntryError()
}
