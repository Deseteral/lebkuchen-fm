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
import xyz.lebkuchenfm.api.respondWithProblem
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
            val username: String? = formParameters["username"]
            val discordId: String? = formParameters["discordId"]

            if (username == null) {
                // TODO: consider installing Validation plugin
                call.respondWithProblem(
                    title = "Could not create user.",
                    detail = "Missing required field: username.",
                    status = HttpStatusCode.BadRequest,
                )
                return@post
            }

            usersService.addNewUser(username, discordId)
                .onSuccess { call.respond(HttpStatusCode.Created, it.toResponse()) }
                .mapError { error ->
                    when (error) {
                        AddNewUserError.UserAlreadyExists ->
                            call.respondWithProblem(
                                title = "Could not create user.",
                                detail = "User already exists.",
                                status = HttpStatusCode.BadRequest,
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
