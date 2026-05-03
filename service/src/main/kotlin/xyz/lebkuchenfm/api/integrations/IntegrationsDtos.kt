package xyz.lebkuchenfm.api.integrations

import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.integrations.DiscordIntegrationPatch
import xyz.lebkuchenfm.domain.integrations.DropboxIntegrationPatch
import xyz.lebkuchenfm.domain.integrations.Integrations
import xyz.lebkuchenfm.domain.integrations.IntegrationsPatch
import xyz.lebkuchenfm.domain.integrations.YoutubeIntegrationPatch

private const val SECRET_HINT_LENGTH = 4
private const val SECRET_HINT_MIN_VALUE_LENGTH = 8

// --- Response DTOs ---

@Serializable
data class SecretState(
    val set: Boolean,
    val hint: String? = null,
)

@Serializable
data class IntegrationsResponse(
    val dropbox: DropboxIntegrationResponse,
    val youtube: YoutubeIntegrationResponse,
    val discord: DiscordIntegrationResponse,
)

@Serializable
data class DropboxIntegrationResponse(
    val appKey: SecretState,
    val appSecret: SecretState,
    val refreshToken: SecretState,
    val xSoundsPath: String?,
)

@Serializable
data class YoutubeIntegrationResponse(
    val apiKey: SecretState,
)

@Serializable
data class DiscordIntegrationResponse(
    val token: SecretState,
    val channelId: String?,
    val commandPrompt: String?,
)

fun Integrations.toResponse(): IntegrationsResponse {
    return IntegrationsResponse(
        dropbox = DropboxIntegrationResponse(
            appKey = dropbox?.appKey.toSecretState(),
            appSecret = dropbox?.appSecret.toSecretState(),
            refreshToken = dropbox?.refreshToken.toSecretState(),
            xSoundsPath = dropbox?.xSoundsPath,
        ),
        youtube = YoutubeIntegrationResponse(
            apiKey = youtube?.apiKey.toSecretState(),
        ),
        discord = DiscordIntegrationResponse(
            token = discord?.token.toSecretState(),
            channelId = discord?.channelId,
            commandPrompt = discord?.commandPrompt,
        ),
    )
}

private fun String?.toSecretState(): SecretState = when {
    this == null -> SecretState(set = false)
    this.length >= SECRET_HINT_MIN_VALUE_LENGTH -> SecretState(set = true, hint = this.takeLast(SECRET_HINT_LENGTH))
    else -> SecretState(set = true)
}

// --- Patch request DTOs ---

@Serializable
data class IntegrationsPatchRequest(
    val dropbox: DropboxIntegrationPatchDto? = null,
    val youtube: YoutubeIntegrationPatchDto? = null,
    val discord: DiscordIntegrationPatchDto? = null,
)

@Serializable
data class DropboxIntegrationPatchDto(
    val appKey: String? = null,
    val appSecret: String? = null,
    val refreshToken: String? = null,
    val xSoundsPath: String? = null,
)

@Serializable
data class YoutubeIntegrationPatchDto(
    val apiKey: String? = null,
)

@Serializable
data class DiscordIntegrationPatchDto(
    val token: String? = null,
    val channelId: String? = null,
    val commandPrompt: String? = null,
)

fun IntegrationsPatchRequest.toDomain(): IntegrationsPatch {
    return IntegrationsPatch(
        dropbox = dropbox?.let {
            DropboxIntegrationPatch(
                appKey = it.appKey,
                appSecret = it.appSecret,
                refreshToken = it.refreshToken,
                xSoundsPath = it.xSoundsPath,
            )
        },
        youtube = youtube?.let {
            YoutubeIntegrationPatch(
                apiKey = it.apiKey,
            )
        },
        discord = discord?.let {
            DiscordIntegrationPatch(
                token = it.token,
                channelId = it.channelId,
                commandPrompt = it.commandPrompt,
            )
        },
    )
}
