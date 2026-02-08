package xyz.lebkuchenfm.api.roles

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.api.missesScopes
import xyz.lebkuchenfm.domain.auth.Role
import xyz.lebkuchenfm.domain.auth.Scope

fun Route.rolesRouting() {
    route("/roles") {
        get {
            if (call.missesScopes(Scope.USERS_MANAGE_ROLES)) {
                return@get
            }
            val response = RolesResponse(Role.all.map { it.toResponse() })
            call.respond(HttpStatusCode.OK, response)
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

fun Role.toResponse(): RoleResponse {
    return RoleResponse(
        name = name,
        scopes = scopes.map { it.value }.sorted(),
    )
}
