package xyz.lebkuchenfm.api.auth

import io.ktor.http.HttpStatusCode
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.principal
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import io.ktor.server.sessions.clear
import io.ktor.server.sessions.sessions
import io.ktor.server.sessions.set
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.api.getUserSession
import xyz.lebkuchenfm.domain.auth.UserSession
import xyz.lebkuchenfm.domain.users.UsersService

fun Route.authRouting(usersService: UsersService) {
    route("/auth") {
        get {
            val session = call.getUserSession()
            val apiToken = usersService.getByName(session.name)?.secret?.apiToken
            call.respond(
                LoggedInResponse(
                    username = session.name,
                    scopes = session.scopes,
                    apiToken = apiToken!!,
                ),
            )
        }

        authenticate("auth-form") {
            post {
                call.principal<UserSession>()?.let {
                    call.sessions.set(it)
                    call.respond(HttpStatusCode.OK)
                }
            }
        }

        post("/logout") {
            call.sessions.clear<UserSession>()
            call.respond(HttpStatusCode.OK)
        }
    }
}

@Serializable
data class LoggedInResponse(
    val username: String,
    val scopes: List<String>,
    val apiToken: String,
)
