package xyz.lebkuchenfm.api

import io.ktor.server.application.ApplicationCall
import io.ktor.server.auth.principal
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import xyz.lebkuchenfm.domain.auth.UserSession

fun ApplicationCall.getUserSession(): UserSession {
    return sessions.get<UserSession>()
        ?: principal<UserSession>()
        ?: throw IllegalStateException("No user session data available.")
}
