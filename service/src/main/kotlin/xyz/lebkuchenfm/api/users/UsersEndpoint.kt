package xyz.lebkuchenfm.api.users

import com.github.michaelbull.result.mapError
import com.github.michaelbull.result.onSuccess
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.put
import io.ktor.server.routing.route
import io.ktor.server.sessions.SessionStorage
import kotlinx.datetime.Instant
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.api.plugins.withScopes
import xyz.lebkuchenfm.api.respondWithProblem
import xyz.lebkuchenfm.domain.auth.Role
import xyz.lebkuchenfm.domain.auth.Scope
import xyz.lebkuchenfm.domain.auth.SessionInvalidationFlow
import xyz.lebkuchenfm.domain.sessions.SessionsService
import xyz.lebkuchenfm.domain.users.AddNewUserError
import xyz.lebkuchenfm.domain.users.UpdateUserRolesError
import xyz.lebkuchenfm.domain.users.UpdateUserRolesResult
import xyz.lebkuchenfm.domain.users.User
import xyz.lebkuchenfm.domain.users.UsersService

fun Route.usersRouting(usersService: UsersService, sessionsService: SessionsService, sessionStorage: SessionStorage) {
    route("/users") {
        getUsers(usersService)

        withScopes(Scope.USERS_MANAGE) {
            postUser(usersService)
            putUserRoles(usersService, sessionsService, sessionStorage)
            deleteUserSessions(sessionsService, sessionStorage)
        }
    }
}

private fun Route.getUsers(usersService: UsersService) = get {
    val users = usersService.getAll()
    val response = UsersResponse(users.map { it.toResponse() })
    call.respond(HttpStatusCode.OK, response)
}

private fun Route.postUser(usersService: UsersService) = post {
    val newUser: NewUser = call.receive()

    usersService.addNewUser(newUser.username, newUser.discordId)
        .onSuccess { call.respond(HttpStatusCode.Created, it.toResponse()) }
        .mapError { error ->
            when (error) {
                AddNewUserError.UserAlreadyExists ->
                    call.respondWithProblem(
                        title = "Could not create user.",
                        detail = "User already exists.",
                        status = HttpStatusCode.Conflict,
                    )

                AddNewUserError.UnknownError ->
                    call.respondWithProblem(
                        title = "Could not create user.",
                        detail = "Unknown error.",
                        status = HttpStatusCode.InternalServerError,
                    )
            }
        }
}

private fun Route.putUserRoles(
    usersService: UsersService,
    sessionsService: SessionsService,
    sessionStorage: SessionStorage,
) = put("{user_name}/roles") {
    val userName = call.parameters["user_name"]
        ?: return@put call.respond(HttpStatusCode.BadRequest)

    val body: UpdateRolesRequest = call.receive()

    val roles = body.roles.map { roleName ->
        Role.fromName(roleName)
            ?: return@put call.respondWithProblem(
                title = "Invalid role.",
                detail = "Unknown role: $roleName.",
                status = HttpStatusCode.BadRequest,
            )
    }.toSet()

    usersService.updateUserRoles(userName, roles)
        .onSuccess { result ->
            if (result is UpdateUserRolesResult.Updated) {
                val sessionIds = sessionsService.getUserSessionIds(userName)
                sessionsService.removeAllSessionsForUser(userName)
                sessionIds.forEach { sessionStorage.invalidate(it) }
                SessionInvalidationFlow.emit(userName)
            }
            call.respond(HttpStatusCode.OK, result.user.toResponse())
        }
        .mapError { error ->
            when (error) {
                UpdateUserRolesError.UserNotFound ->
                    call.respondWithProblem(
                        title = "User not found.",
                        detail = "User '$userName' does not exist.",
                        status = HttpStatusCode.NotFound,
                    )

                UpdateUserRolesError.WouldRemoveLastOwner ->
                    call.respondWithProblem(
                        title = "Cannot remove last owner.",
                        detail = "At least one user must have the OWNER role.",
                        status = HttpStatusCode.Conflict,
                    )

                UpdateUserRolesError.UnknownError ->
                    call.respondWithProblem(
                        title = "Could not update roles.",
                        detail = "Unknown error.",
                        status = HttpStatusCode.InternalServerError,
                    )
            }
        }
}

private fun Route.deleteUserSessions(sessionsService: SessionsService, sessionStorage: SessionStorage) =
    delete("{user_name}/sessions") {
        val userName = call.parameters["user_name"] ?: return@delete call.respond(HttpStatusCode.BadRequest)
        val sessionIds = sessionsService.getUserSessionIds(userName)
        sessionsService.removeAllSessionsForUser(userName)
        sessionIds.forEach { sessionStorage.invalidate(it) }
        SessionInvalidationFlow.emit(userName)
        call.respond(HttpStatusCode.Accepted)
    }

@Serializable
data class NewUser(
    val username: String,
    val discordId: String?,
)

@Serializable
data class UpdateRolesRequest(
    val roles: List<String>,
)

@Serializable
data class UsersResponse(val users: List<UserResponse>)

@Serializable
data class UserResponse(
    val username: String,
    val discordId: String?,
    val creationDate: Instant,
    val lastLoggedIn: Instant,
    val roles: List<String>,
)

fun User.toResponse(): UserResponse {
    return UserResponse(
        username = this.data.name,
        discordId = this.data.discordId,
        creationDate = this.data.creationDate,
        lastLoggedIn = this.data.lastLoggedIn,
        roles = this.data.roles.map { it.name }.sorted(),
    )
}
