package xyz.lebkuchenfm.domain.integrations

import com.github.michaelbull.result.Result
import com.github.michaelbull.result.map

class IntegrationsService(private val repository: IntegrationsRepository) {

    suspend fun getIntegrations(): Integrations {
        return repository.get() ?: Integrations()
    }

    suspend fun storeIntegrations(integrations: Integrations): Result<Integrations, IntegrationsRepositoryError> {
        return repository.upsert(integrations).map { it }
    }
}
