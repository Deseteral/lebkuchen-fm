package xyz.lebkuchenfm.api.auth

import com.github.michaelbull.result.get
import com.github.michaelbull.result.onFailure
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.auth.BearerTokenCredential
import io.ktor.server.auth.UserPasswordCredential
import io.ktor.server.sessions.clear
import io.ktor.server.sessions.sessions
import xyz.lebkuchenfm.api.respondWithProblem
import xyz.lebkuchenfm.domain.auth.AuthError
import xyz.lebkuchenfm.domain.auth.AuthService
import xyz.lebkuchenfm.domain.auth.UserSession
import xyz.lebkuchenfm.domain.users.AddNewUserError
import xyz.lebkuchenfm.domain.users.SetPasswordError

class ValidateAuthHandler(private val authService: AuthService) {
    suspend fun credentialsHandler(credentials: UserPasswordCredential, call: ApplicationCall): UserSession? {
        return authService
            .authenticateWithCredentials(credentials.name, credentials.password)
            .onFailure { error ->
                when (error) {
                    AuthError.BadCredentialsError, AuthError.UserDoesNotExistError -> {
                        call.respondWithProblem(
                            title = "Could not authenticate.",
                            detail = "User does not exist or wrong password was provided.",
                            status = HttpStatusCode.Unauthorized,
                        )
                    }

                    is AuthError.CannotAddNewUserError -> {
                        call.respondWithProblem(
                            title = "Could not create new user.",
                            detail = when (error.addNewUserError) {
                                AddNewUserError.UserAlreadyExists -> "User already exists."
                                AddNewUserError.UnknownError -> "Something went wrong."
                            },
                            status = HttpStatusCode.Unauthorized,
                        )
                    }

                    is AuthError.CannotSetPasswordError -> {
                        call.respondWithProblem(
                            title = "Could not set password for user.",
                            detail = when (error.setPasswordError) {
                                SetPasswordError.UserDoesNotExist -> "User does not exist."

                                is SetPasswordError.ValidationError -> listOfNotNull(
                                    "Password is too weak:",
                                    "too short".takeIf { error.setPasswordError.tooShort },
                                ).joinToString(separator = " ")

                                SetPasswordError.UnknownError -> "Something went wrong."
                            },
                            status = HttpStatusCode.Unauthorized,
                        )
                    }
                }
            }
            .get()
    }

    suspend fun apiTokenHandler(tokenCredential: BearerTokenCredential, call: ApplicationCall): UserSession? {
        return authService.authenticateWithApiToken(tokenCredential.token) ?: run {
            call.respondWithProblem(
                title = "Could not authenticate.",
                detail = "Provided API token is not active.",
                status = HttpStatusCode.Unauthorized,
            )
            null
        }
    }

    suspend fun badSessionHandler(call: ApplicationCall) {
        call.sessions.clear<UserSession>()
        call.respondWithProblem(
            title = "Could not authenticate.",
            detail = "You are not authenticated.",
            status = HttpStatusCode.Unauthorized,
        )
    }
}
