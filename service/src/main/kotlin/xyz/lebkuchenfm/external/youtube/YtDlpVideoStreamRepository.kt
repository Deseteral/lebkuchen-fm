package xyz.lebkuchenfm.external.youtube

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.youtube.YouTubeVideoStreamRepository
import xyz.lebkuchenfm.domain.youtube.YoutubeVideoId
import xyz.lebkuchenfm.external.platform.ProcessExecutor

private val logger = KotlinLogging.logger {}

class YtDlpVideoStreamRepository(private val processExecutor: ProcessExecutor) : YouTubeVideoStreamRepository {
    override fun getVideoStreamUrl(youtubeId: YoutubeVideoId): String? {
        val youtubeUrl = "https://www.youtube.com/watch?v=${youtubeId.value}"
        val streamFormat = "best[height<=1080]"
        val result = processExecutor.exec("""yt-dlp -f "$streamFormat" -g "$youtubeUrl"""")

        if (result.exitCode != 0) {
            logger.error { "yt-dlp exited with code ${result.exitCode} for video $youtubeId." }
            result.stderr.forEach { logger.error { "yt-dlp stderr: $it" } }
        }

        return result.stdout.firstOrNull()
    }
}
