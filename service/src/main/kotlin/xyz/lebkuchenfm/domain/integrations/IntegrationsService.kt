package xyz.lebkuchenfm.domain.integrations

import com.github.michaelbull.result.Result
import com.github.michaelbull.result.map
import io.github.oshai.kotlinlogging.KotlinLogging

private val logger = KotlinLogging.logger {}

class IntegrationsService(private val repository: IntegrationsRepository) {

    suspend fun getIntegrations(): Integrations {
        return repository.get() ?: Integrations()
    }

    suspend fun patchIntegrations(patch: IntegrationsPatch): Result<Integrations, IntegrationsRepositoryError> {
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

private fun Integrations.applyPatch(patch: IntegrationsPatch): Integrations = copy(
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

data class IntegrationsPatch(
    val dropbox: DropboxIntegrationPatch? = null,
    val youtube: YoutubeIntegrationPatch? = null,
    val discord: DiscordIntegrationPatch? = null,
)

data class DropboxIntegrationPatch(
    val appKey: String? = null,
    val appSecret: String? = null,
    val refreshToken: String? = null,
    val xSoundsPath: String? = null,
)

data class YoutubeIntegrationPatch(
    val apiKey: String? = null,
)

data class DiscordIntegrationPatch(
    val token: String? = null,
    val channelId: String? = null,
    val commandPrompt: String? = null,
)
