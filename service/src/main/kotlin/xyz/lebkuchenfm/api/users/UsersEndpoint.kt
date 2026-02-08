package xyz.lebkuchenfm.api.users

import com.github.michaelbull.result.mapError
import com.github.michaelbull.result.onFailure
import com.github.michaelbull.result.onSuccess
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.put
import io.ktor.server.routing.route
import kotlinx.datetime.Instant
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.api.missesScopes
import xyz.lebkuchenfm.api.respondWithProblem
import xyz.lebkuchenfm.domain.auth.Role
import xyz.lebkuchenfm.domain.auth.Scope
import xyz.lebkuchenfm.domain.users.AddNewUserError
import xyz.lebkuchenfm.domain.users.UpdateRoleError
import xyz.lebkuchenfm.domain.users.User
import xyz.lebkuchenfm.domain.users.UsersService

fun Route.usersRouting(usersService: UsersService) {
    route("/users") {
        get {
            if (call.missesScopes(Scope.USERS_LIST)) {
                return@get
            }
            val users = usersService.getAll()
            val response = UsersResponse(users.map { it.toResponse() })
            call.respond(HttpStatusCode.OK, response)
        }

        post {
            if (call.missesScopes(Scope.USERS_ADD)) {
                return@post
            }
            val newUser: NewUser = call.receive()

            val invalidRoleNames = newUser.roles.filter { Role.fromString(it) == null }
            if (invalidRoleNames.isNotEmpty()) {
                call.respondWithProblem(
                    title = "Bad Request",
                    detail = "Unknown roles: ${invalidRoleNames.joinToString(", ")}.",
                    status = HttpStatusCode.BadRequest,
                )
                return@post
            }

            val roles = newUser.roles.mapNotNull { Role.fromString(it) }.toSet()
                .ifEmpty { setOf(Role.LISTENER) }

            usersService.addNewUser(newUser.username, newUser.discordId, roles)
                .onSuccess { call.respond(HttpStatusCode.Created, it.toResponse()) }
                .mapError { error ->
                    when (error) {
                        AddNewUserError.UserAlreadyExists ->
                            call.respondWithProblem(
                                title = "Could not create user.",
                                detail = "User already exists.",
                                status = HttpStatusCode.Conflict,
                            )

                        AddNewUserError.NotFirstUser,
                        AddNewUserError.UnknownError ->
                            call.respondWithProblem(
                                title = "Could not create user.",
                                detail = "Unknown error.",
                                status = HttpStatusCode.InternalServerError,
                            )
                    }
                }
        }

        put("/{name}/roles") {
            if (call.missesScopes(Scope.USERS_MANAGE_ROLES)) {
                return@put
            }
            val username = call.parameters["name"] ?: run {
                call.respondWithProblem(
                    title = "Bad Request",
                    detail = "Username is required.",
                    status = HttpStatusCode.BadRequest,
                )
                return@put
            }

            val roleRequest: UserRoleRequest = call.receive()

            val invalidRoleNames = roleRequest.roles.filter { Role.fromString(it) == null }
            if (invalidRoleNames.isNotEmpty()) {
                call.respondWithProblem(
                    title = "Bad Request",
                    detail = "Unknown roles: ${invalidRoleNames.joinToString(", ")}.",
                    status = HttpStatusCode.BadRequest,
                )
                return@put
            }

            val roles = roleRequest.roles.mapNotNull { Role.fromString(it) }.toSet()
            if (roles.isEmpty()) {
                call.respondWithProblem(
                    title = "Bad Request",
                    detail = "At least one role is required.",
                    status = HttpStatusCode.BadRequest,
                )
                return@put
            }

            val user = usersService.getByName(username) ?: run {
                call.respondWithProblem(
                    title = "User not found",
                    detail = "User with name '$username' not found.",
                    status = HttpStatusCode.NotFound,
                )
                return@put
            }

            usersService.updateUserRoles(user, roles)
                .onSuccess { call.respond(HttpStatusCode.OK, it.toResponse()) }
                .onFailure { error ->
                    when (error) {
                        is UpdateRoleError.UserNotFound ->
                            call.respondWithProblem(
                                title = "Could not update user role.",
                                detail = "User '${user.data.name}' not found.",
                                status = HttpStatusCode.NotFound,
                            )
                        is UpdateRoleError.AtLeastOneOwnerMustExist ->
                            call.respondWithProblem(
                                title = "At least one owner must exist.",
                                detail = "User '${user.data.name}' is the only owner.",
                                status = HttpStatusCode.Conflict,
                            )
                        is UpdateRoleError.WriteError ->
                            call.respondWithProblem(
                                title = "Could not update user role.",
                                detail = "Unknown error occurred.",
                                status = HttpStatusCode.InternalServerError,
                            )
                    }
                }
        }
    }
}

@Serializable
data class NewUser(
    val username: String,
    val discordId: String?,
    val roles: List<String> = emptyList(),
)

@Serializable
data class UserRoleRequest(
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
        roles = this.data.roles.map { it.name },
    )
}
