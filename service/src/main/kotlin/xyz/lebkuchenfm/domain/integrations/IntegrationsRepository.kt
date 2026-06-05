package xyz.lebkuchenfm.domain.integrations

import com.github.michaelbull.result.Result

interface IntegrationsRepository {
    suspend fun get(): Integrations?
    suspend fun upsert(integrations: Integrations): Result<Integrations, IntegrationsRepositoryError>
}

sealed class IntegrationsRepositoryError {
    data object DatabaseError : IntegrationsRepositoryError()
}
