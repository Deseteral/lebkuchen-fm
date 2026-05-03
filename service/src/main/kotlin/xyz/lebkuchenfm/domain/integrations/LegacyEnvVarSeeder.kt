package xyz.lebkuchenfm.domain.integrations

import com.github.michaelbull.result.getOrElse
import io.github.oshai.kotlinlogging.KotlinLogging

private val logger = KotlinLogging.logger {}

class LegacyEnvVarSeeder(
    private val repository: IntegrationsRepository,
    private val getEnvVar: (String) -> String?,
) {
    suspend fun seedIfEmpty() {
        if (repository.get() != null) {
            logger.info { "Integrations document already exists — skipping environment seed." }
            return
        }

        val dropbox = seedDropbox()
        val youtube = seedYoutube()
        val discord = seedDiscord()

        if (dropbox == null && youtube == null && discord == null) {
            logger.info { "No legacy integration env vars found — nothing to seed." }
            return
        }

        val integrations = Integrations(dropbox = dropbox, youtube = youtube, discord = discord)
        repository.upsert(integrations).getOrElse {
            logger.error { "Failed to seed integrations from environment." }
            return
        }

        logger.info { "Integrations seeded from legacy environment variables." }
    }

    private fun seedDropbox(): DropboxIntegration? {
        val appKey = readLegacyEnvVar("DROPBOX_CLIENT_ID")
        val appSecret = readLegacyEnvVar("DROPBOX_SECRET")
        val refreshToken = readLegacyEnvVar("DROPBOX_REFRESH_TOKEN")
        val xSoundsPath = readLegacyEnvVar("DROPBOX_X_SOUNDS_PATH")

        return if (listOfNotNull(appKey, appSecret, refreshToken, xSoundsPath).isEmpty()) {
            null
        } else {
            DropboxIntegration(
                appKey = appKey,
                appSecret = appSecret,
                refreshToken = refreshToken,
                xSoundsPath = xSoundsPath,
            )
        }
    }

    private fun seedYoutube(): YoutubeIntegration? {
        val apiKey = readLegacyEnvVar("YOUTUBE_API_KEY")
        return apiKey?.let { YoutubeIntegration(apiKey = it) }
    }

    private fun seedDiscord(): DiscordIntegration? {
        val token = readLegacyEnvVar("DISCORD_TOKEN")
        val channelId = readLegacyEnvVar("DISCORD_CHANNEL_ID")
        val commandPrompt = readLegacyEnvVar("COMMAND_PROMPT")

        return if (listOfNotNull(token, channelId, commandPrompt).isEmpty()) {
            null
        } else {
            DiscordIntegration(
                token = token,
                channelId = channelId,
                commandPrompt = commandPrompt,
            )
        }
    }

    private fun readLegacyEnvVar(envVarName: String): String? {
        val value = getEnvVar(envVarName)
        if (value != null) {
            logger.warn {
                "$envVarName env var found and seeded into runtime integrations config. " +
                    "This variable is no longer read after initial seeding. Remove it from your environment."
            }
        }
        return value
    }
}
