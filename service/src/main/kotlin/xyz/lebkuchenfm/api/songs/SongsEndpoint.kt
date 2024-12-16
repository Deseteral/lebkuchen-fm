package xyz.lebkuchenfm.api.songs

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.songs.Song
import xyz.lebkuchenfm.domain.songs.SongsService

fun Route.songsRouting(songsService: SongsService) {
    route("/songs") {
        get {
            val songs = songsService.getAllSongs()
            val response = SongsResponse(songs.map { it.toResponse() })
            call.respond(HttpStatusCode.OK, response)
        }
    }
}

@Serializable
data class SongsResponse(val songs: List<SongResponse>)

@Serializable
data class SongResponse(
    val name: String,
    val youtubeId: String,
    val trimStartSeconds: Int?,
    val trimEndSeconds: Int?,
    val timesPlayed: Int,
)

fun Song.toResponse(): SongResponse {
    return SongResponse(
        name = this.name,
        youtubeId = this.youtubeId.value,
        trimStartSeconds = this.trimStartSeconds,
        trimEndSeconds = this.trimEndSeconds,
        timesPlayed = this.timesPlayed,
    )
}
