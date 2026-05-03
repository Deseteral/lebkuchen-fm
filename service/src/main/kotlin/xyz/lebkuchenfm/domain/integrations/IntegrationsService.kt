package xyz.lebkuchenfm.domain.integrations

import com.github.michaelbull.result.Result
import com.github.michaelbull.result.map

class IntegrationsService(private val repository: IntegrationsRepository) {

    suspend fun getIntegrations(): Integrations {
        return repository.get() ?: Integrations()
    }

    /**
     * Merges [patch] onto the current integrations config and persists the result.
     *
     * Within the patch, `null` groups are skipped (no change). Within a group,
     * `null` fields mean no change, `""` (empty string) clears the value,
     * and any other string sets a new value.
     */
    suspend fun patchIntegrations(patch: Integrations): Result<Integrations, IntegrationsRepositoryError> {
        val current = getIntegrations()
        val merged = current.applyPatch(patch)
        return repository.upsert(merged).map { it }
    }
}

/**
 * Merge logic for PATCH requests. For each field:
 * - `null` in the patch → keep the current value (field was absent from the request)
 * - `""` (empty string) → clear the value (set to null)
 * - any other string → set to the new value
 */
private fun mergeField(patch: String?, current: String?): String? = when (patch) {
    null -> current
    "" -> null
    else -> patch
}

private fun Integrations.applyPatch(patch: Integrations): Integrations = copy(
    dropbox = patch.dropbox?.let { p ->
        val current = dropbox ?: DropboxIntegration()
        current.copy(
            appKey = mergeField(p.appKey, current.appKey),
            appSecret = mergeField(p.appSecret, current.appSecret),
            refreshToken = mergeField(p.refreshToken, current.refreshToken),
            xSoundsPath = mergeField(p.xSoundsPath, current.xSoundsPath),
        )
    } ?: dropbox,
    youtube = patch.youtube?.let { p ->
        val current = youtube ?: YoutubeIntegration()
        current.copy(
            apiKey = mergeField(p.apiKey, current.apiKey),
        )
    } ?: youtube,
    discord = patch.discord?.let { p ->
        val current = discord ?: DiscordIntegration()
        current.copy(
            token = mergeField(p.token, current.token),
            channelId = mergeField(p.channelId, current.channelId),
            commandPrompt = mergeField(p.commandPrompt, current.commandPrompt),
        )
    } ?: discord,
)
