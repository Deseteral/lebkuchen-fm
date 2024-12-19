package xyz.lebkuchenfm.api.users

import com.github.michaelbull.result.mapError
import com.github.michaelbull.result.onSuccess
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receiveParameters
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import kotlinx.datetime.Instant
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.api.getUserSession
import xyz.lebkuchenfm.domain.users.AddNewUserError
import xyz.lebkuchenfm.domain.users.User
import xyz.lebkuchenfm.domain.users.UsersService

fun Route.usersRouting(usersService: UsersService) {
    route("/users") {
        get {
            val users = usersService.getAll()
            val response = UsersResponse(users.map { it.toResponse() })
            call.respond(HttpStatusCode.OK, response)
        }

        post {
            val session = call.getUserSession()

            val formParameters = call.receiveParameters()
            print(formParameters.names())
            val username: String? = formParameters["username"]
            val discordId: String? = formParameters["discordId"]

            if (username == null) {
                // TODO: consider installing Validation plugin
                call.respond(HttpStatusCode.BadRequest, "Missing required field: username.")
                return@post
            }

            usersService.addNewUser(username, discordId)
                .onSuccess { call.respond(HttpStatusCode.Created, it.toResponse()) }
                .mapError { error ->
                    call.respond(
                        when (error) {
                            AddNewUserError.UserAlreadyExists -> HttpStatusCode.Conflict
                            AddNewUserError.UnknownError -> HttpStatusCode.InternalServerError
                        },
                        "$error",
                    )
                }
        }
    }
}

@Serializable
data class UsersResponse(val users: List<UserResponse>)

@Serializable
data class UserResponse(
    val username: String,
    val discordId: String?,
    val creationDate: Instant,
    val lastLoggedIn: Instant,
)

fun User.toResponse(): UserResponse {
    return UserResponse(
        username = this.data.name,
        discordId = this.data.discordId,
        creationDate = this.data.creationDate,
        lastLoggedIn = this.data.lastLoggedIn,
    )
}
