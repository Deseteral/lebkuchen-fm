package xyz.lebkuchenfm.domain.history

import com.github.michaelbull.result.Result

interface HistoryRepository {
    suspend fun insert(history: HistoryEntry): Result<HistoryEntry, HistoryRepositoryError>
}

sealed class HistoryRepositoryError {
    data object UnknownError : HistoryRepositoryError()
}
