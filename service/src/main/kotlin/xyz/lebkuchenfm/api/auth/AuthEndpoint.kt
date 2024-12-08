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
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import io.ktor.server.sessions.set
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.auth.UserSession

fun Route.authRouting() {
    route("/auth") {
        get {
            val session = call.sessions.get<UserSession>()!!
            call.respond(LoggedInResponse(username = session.name, apiToken = session.apiToken))
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
    val apiToken: String,
)
