package xyz.lebkuchenfm.api.auth

import com.github.michaelbull.result.get
import com.github.michaelbull.result.onFailure
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.auth.BearerTokenCredential
import io.ktor.server.auth.UserPasswordCredential
import io.ktor.server.request.uri
import io.ktor.server.response.respond
import xyz.lebkuchenfm.api.ProblemResponse
import xyz.lebkuchenfm.api.toDto
import xyz.lebkuchenfm.domain.auth.AuthError
import xyz.lebkuchenfm.domain.auth.AuthService
import xyz.lebkuchenfm.domain.auth.UserSession
import xyz.lebkuchenfm.domain.users.AddNewUserError
import xyz.lebkuchenfm.domain.users.SetPasswordError

class ValidateAuthHandler(private val authService: AuthService) {
    suspend fun credentialsHandler(credentials: UserPasswordCredential, call: ApplicationCall): UserSession? {
        return authService.authenticateWithCredentials(credentials.name, credentials.password)
            .onFailure { error ->
                val status = HttpStatusCode.Unauthorized
                val instance = call.request.uri
                val response: ProblemResponse = when (error) {
                    AuthError.BadCredentialsError -> ProblemResponse(
                        "Could not authenticate.",
                        "Wrong password was provided.",
                        status,
                        instance,
                    )

                    AuthError.UserDoesNotExistError -> ProblemResponse(
                        "Could not authenticate.",
                        "User does not exist.",
                        status,
                        instance,
                    )

                    is AuthError.CannotAddNewUserError -> {
                        val title = "Could not create new user."
                        val detail = when (error.addNewUserError) {
                            AddNewUserError.UserAlreadyExists -> "User already exists."
                            AddNewUserError.UnknownError -> "Something went wrong."
                        }
                        ProblemResponse(title, detail, status, instance)
                    }

                    is AuthError.CannotSetPasswordError -> {
                        val title = "Could not set password for user."
                        val detail = when (error.setPasswordError) {
                            SetPasswordError.UserDoesNotExist -> "User does not exist."
                            is SetPasswordError.ValidationError -> listOfNotNull(
                                "Password is too weak:",
                                "too short".takeIf { error.setPasswordError.tooShort },
                            ).joinToString(separator = " ")
                            SetPasswordError.UnknownError -> "Something went wrong."
                        }
                        ProblemResponse(title, detail, status, instance)
                    }
                }
                call.respond(status, response.toDto())
            }
            .get()
    }

    suspend fun apiTokenHandler(tokenCredential: BearerTokenCredential, call: ApplicationCall): UserSession? {
        return authService.authenticateWithApiToken(tokenCredential.token) ?: run {
            val status = HttpStatusCode.Unauthorized
            val response = ProblemResponse(
                "Could not authenticate.",
                "Provided API token is not active.",
                status,
                call.request.uri,
            )
            call.respond(status, response.toDto())
            null
        }
    }

    suspend fun badSessionHandler(call: ApplicationCall) {
        val status = HttpStatusCode.Unauthorized
        val response = ProblemResponse(
            "Could not authenticate.",
            "You are not authenticated.",
            status,
            call.request.uri,
        )
        call.respond(status, response.toDto())
    }
}
