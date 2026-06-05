package xyz.lebkuchenfm.api.integrations

import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.integrations.DiscordIntegration
import xyz.lebkuchenfm.domain.integrations.DropboxIntegration
import xyz.lebkuchenfm.domain.integrations.Integrations
import xyz.lebkuchenfm.domain.integrations.YoutubeIntegration

// --- Request DTO (mirrors domain for JSON Merge Patch serialization) ---

@Serializable
data class IntegrationsDto(
    val dropbox: DropboxIntegrationDto? = null,
    val youtube: YoutubeIntegrationDto? = null,
    val discord: DiscordIntegrationDto? = null,
)

@Serializable
data class DropboxIntegrationDto(
    val appKey: String? = null,
    val appSecret: String? = null,
    val refreshToken: String? = null,
    val xSoundsPath: String? = null,
)

@Serializable
data class YoutubeIntegrationDto(
    val apiKey: String? = null,
)

@Serializable
data class DiscordIntegrationDto(
    val token: String? = null,
    val channelId: String? = null,
    val commandPrompt: String? = null,
)

fun IntegrationsDto.toDomain(): Integrations {
    return Integrations(
        dropbox = dropbox?.let {
            DropboxIntegration(
                appKey = it.appKey,
                appSecret = it.appSecret,
                refreshToken = it.refreshToken,
                xSoundsPath = it.xSoundsPath,
            )
        },
        youtube = youtube?.let {
            YoutubeIntegration(apiKey = it.apiKey)
        },
        discord = discord?.let {
            DiscordIntegration(
                token = it.token,
                channelId = it.channelId,
                commandPrompt = it.commandPrompt,
            )
        },
    )
}

fun Integrations.toDto(): IntegrationsDto {
    return IntegrationsDto(
        dropbox = dropbox?.let {
            DropboxIntegrationDto(
                appKey = it.appKey,
                appSecret = it.appSecret,
                refreshToken = it.refreshToken,
                xSoundsPath = it.xSoundsPath,
            )
        },
        youtube = youtube?.let {
            YoutubeIntegrationDto(apiKey = it.apiKey)
        },
        discord = discord?.let {
            DiscordIntegrationDto(
                token = it.token,
                channelId = it.channelId,
                commandPrompt = it.commandPrompt,
            )
        },
    )
}

// --- Response DTOs (secure—secrets are masked) ---

@Serializable
data class SecretState(
    val set: Boolean,
    val suffix: String? = null,
    val length: Int? = null,
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

fun Integrations.toSecureResponse(): IntegrationsResponse {
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
    else -> {
        val revealCount = minOf(this.length / 4, 4)
        SecretState(set = true, suffix = this.takeLast(revealCount), length = this.length)
    }
}
