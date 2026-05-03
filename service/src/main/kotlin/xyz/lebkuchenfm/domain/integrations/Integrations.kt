package xyz.lebkuchenfm.domain.integrations

data class Integrations(
    val dropbox: DropboxIntegration? = null,
    val youtube: YoutubeIntegration? = null,
    val discord: DiscordIntegration? = null,
)

data class DropboxIntegration(
    val appKey: String? = null,
    val appSecret: String? = null,
    val refreshToken: String? = null,
    val xSoundsPath: String? = null,
)

data class YoutubeIntegration(
    val apiKey: String? = null,
)

data class DiscordIntegration(
    val token: String? = null,
    val channelId: String? = null,
    val commandPrompt: String? = null,
) {
    val effectiveCommandPrompt: String get() = commandPrompt ?: DEFAULT_COMMAND_PROMPT

    private companion object {
        const val DEFAULT_COMMAND_PROMPT = "/fm"
    }
}
