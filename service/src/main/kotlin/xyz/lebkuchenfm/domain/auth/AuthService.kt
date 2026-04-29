package xyz.lebkuchenfm.domain.auth

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.map
import com.github.michaelbull.result.mapError
import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.sessions.UserSession
import xyz.lebkuchenfm.domain.users.CreateFirstUserError
import xyz.lebkuchenfm.domain.users.SetPasswordError
import xyz.lebkuchenfm.domain.users.UsersService

private val logger = KotlinLogging.logger {}

class AuthService(private val usersService: UsersService) {
    suspend fun authenticateWithCredentials(username: String, password: String): Result<UserSession, AuthError> {
        val user = usersService.getByName(username)

        return when {
            user == null -> {
                usersService.createFirstUser(username, password)
                    .map {
                        logger.info { "User '$username' is the first user to log in." }
                        UserSession(it.data.name, it.effectiveScopes)
                    }
                    .mapError {
                        when (it) {
                            CreateFirstUserError.UsersAlreadyExist -> {
                                logger.info { "User '$username' tried to log in, but does not exist." }
                                AuthError.UserDoesNotExistError
                            }
                            is CreateFirstUserError.PasswordValidationError -> {
                                AuthError.CannotSetPasswordError(it.error)
                            }
                            CreateFirstUserError.UnknownError -> {
                                logger.error { "Something went wrong while creating first user '$username'." }
                                AuthError.UnknownError
                            }
                        }
                    }
            }

            !user.hasPasswordSet -> {
                logger.info { "User '${user.data.name}' is logging in for the first time." }
                usersService.setPassword(user, password)
                    .map { UserSession(it.data.name, it.effectiveScopes) }
                    .mapError { AuthError.CannotSetPasswordError(it) }
            }

            else -> {
                if (usersService.checkPassword(user, password)) {
                    logger.info { "User '${user.data.name}' logged in." }
                    usersService.updateLastLoginDate(user)
                    Ok(UserSession(user.data.name, user.effectiveScopes))
                } else {
                    logger.info { "User '${user.data.name}' tried to log in, but provided wrong password." }
                    Err(AuthError.BadCredentialsError)
                }
            }
        }
    }

    suspend fun authenticateWithApiToken(token: String): UserSession? {
        return usersService.getByApiToken(token)?.let { UserSession(it.data.name, it.effectiveScopes) }
    }
}

sealed class AuthError {
    data class CannotSetPasswordError(val setPasswordError: SetPasswordError) : AuthError()
    data object UserDoesNotExistError : AuthError()
    data object BadCredentialsError : AuthError()
    data object UnknownError : AuthError()
}
