package xyz.lebkuchenfm.domain.auth

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.flatten
import com.github.michaelbull.result.map
import com.github.michaelbull.result.mapError
import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.users.AddNewUserError
import xyz.lebkuchenfm.domain.users.SetPasswordError
import xyz.lebkuchenfm.domain.users.UsersService

private val logger = KotlinLogging.logger {}

class AuthService(private val usersService: UsersService) {
    suspend fun authenticateWithCredentials(username: String, password: String): Result<UserSession, AuthError> {
        val user = usersService.getByName(username)

        return when {
            user == null && usersService.getUsersCount() == 0L -> {
                logger.info { "User '$username' is the first user to log in." }

                usersService.addNewUser(username)
                    .mapError { AuthError.CannotAddNewUserError(it) }
                    .map { newUser ->
                        usersService.setPassword(
                            newUser,
                            password,
                        ).mapError { AuthError.CannotSetPasswordError(it) }
                    }
                    .flatten()
                    .map { UserSession(it.data.name.value) }
            }

            user == null -> {
                logger.info { "User '$username' tried to log in, but does not exist." }
                Err(AuthError.UserDoesNotExistError)
            }

            !user.hasPasswordSet -> {
                logger.info { "User '${user.data.name}' is logging in for the first time." }
                usersService.setPassword(user, password)
                    .map { UserSession(it.data.name.value) }
                    .mapError { AuthError.CannotSetPasswordError(it) }
            }

            else -> {
                if (usersService.checkPassword(user, password)) {
                    logger.info { "User '${user.data.name}' logged in." }
                    usersService.updateLastLoginDate(user)
                    Ok(UserSession(user.data.name.value))
                } else {
                    logger.info { "User '${user.data.name}' tried to log in, but provided wrong password." }
                    Err(AuthError.BadCredentialsError)
                }
            }
        }
    }

    suspend fun authenticateWithApiToken(token: String): UserSession? {
        return usersService.getByApiToken(token)?.let { UserSession(it.data.name.value) }
    }
}

sealed class AuthError {
    data class CannotSetPasswordError(val setPasswordError: SetPasswordError) : AuthError()
    data class CannotAddNewUserError(val addNewUserError: AddNewUserError) : AuthError()
    data object UserDoesNotExistError : AuthError()
    data object BadCredentialsError : AuthError()
}
