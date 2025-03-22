package xyz.lebkuchenfm.external.youtube

import xyz.lebkuchenfm.domain.youtube.YouTubeVideoStreamRepository
import xyz.lebkuchenfm.domain.youtube.YoutubeVideoId
import xyz.lebkuchenfm.external.platform.Shell

class YtDlpVideoStreamRepository(private val shell: Shell) : YouTubeVideoStreamRepository {
    override fun getVideoStreamUrl(youtubeId: YoutubeVideoId): String? {
        val youtubeUrl = "https://www.youtube.com/watch?v=${youtubeId.value}"
        val streamFormat = "best[height<=1080]"
        return shell.exec("""yt-dlp -f "$streamFormat" -g "$youtubeUrl"""").firstOrNull()
    }
}
