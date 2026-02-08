package xyz.lebkuchenfm.api.roles

import com.github.michaelbull.result.onFailure
import com.github.michaelbull.result.onSuccess
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.put
import io.ktor.server.routing.route
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.api.missesScopes
import xyz.lebkuchenfm.api.respondWithProblem
import xyz.lebkuchenfm.domain.auth.Role
import xyz.lebkuchenfm.domain.auth.Scope
import xyz.lebkuchenfm.domain.users.UsersService
import xyz.lebkuchenfm.domain.users.UpdateRoleError as UsersUpdateRoleError

fun Route.rolesRouting(usersService: UsersService) {
    route("/roles") {
        get {
            if (call.missesScopes(Scope.USERS_MANAGE_ROLES)) {
                return@get
            }
            val response = RolesResponse(Role.all.map { it.toResponse() })
            call.respond(HttpStatusCode.OK, response)
        }
    }

    put("/users/{name}/roles") {
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

        val user = usersService.getByName(username) ?: run {
            call.respondWithProblem(
                title = "User not found",
                detail = "User with name '$username' not found.",
                status = HttpStatusCode.NotFound,
            )
            return@put
        }

        val roles = roleRequest.roles.mapNotNull { Role.fromString(it) }.takeIf { it.isNotEmpty() } ?: run {
            call.respondWithProblem(
                title = "Bad Request",
                detail = "Invalid roles requested.",
                status = HttpStatusCode.BadRequest,
            )
            return@put
        }

        usersService.updateUserRoles(user, roles.toSet())
            .onSuccess { call.respond(HttpStatusCode.OK, it.toResponse()) }
            .onFailure { error ->
                when (error) {
                    is UsersUpdateRoleError.UserNotFound ->
                        call.respondWithProblem(
                            title = "Could not update user role.",
                            detail = "User '${user.data.name}' not found.",
                            status = HttpStatusCode.NotFound,
                        )
                    is UsersUpdateRoleError.AtLeastOneOwnerMustExist ->
                        call.respondWithProblem(
                            title = "At least one owner must exist.",
                            detail = "User '${user.data.name}' is the only owner.",
                            status = HttpStatusCode.Conflict,
                        )
                    is UsersUpdateRoleError.WriteError ->
                        call.respondWithProblem(
                            title = "Could not update user role.",
                            detail = "Unknown error occurred.",
                            status = HttpStatusCode.InternalServerError,
                        )
                }
            }
    }
}

@Serializable
data class RolesResponse(val roles: List<RoleResponse>)

@Serializable
data class RoleResponse(
    val name: String,
    val scopes: List<String>,
)

@Serializable
data class UserRoleRequest(
    val roles: List<String>,
)

fun xyz.lebkuchenfm.domain.auth.Role.toResponse(): RoleResponse {
    return RoleResponse(
        name = name,
        scopes = scopes.map { it.value }.sorted(),
    )
}

fun xyz.lebkuchenfm.domain.users.User.toResponse(): UserWithRoleResponse {
    return UserWithRoleResponse(
        username = this.data.name,
        roles = this.data.roles.map { it.name },
    )
}

@Serializable
data class UserWithRoleResponse(
    val username: String,
    val roles: List<String>,
)
