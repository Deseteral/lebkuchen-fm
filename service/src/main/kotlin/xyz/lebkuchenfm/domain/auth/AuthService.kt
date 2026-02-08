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
import xyz.lebkuchenfm.domain.users.User
import xyz.lebkuchenfm.domain.users.UsersService

private val logger = KotlinLogging.logger {}

class AuthService(
    private val usersService: UsersService,
) {
    suspend fun authenticateWithCredentials(username: String, password: String): Result<UserSession, AuthError> {
        val user = usersService.getByName(username)

        return when {
            user == null -> {
                usersService.addFirstUser(username, null)
                    .mapError { err ->
                        when (err) {
                            AddNewUserError.NotFirstUser -> AuthError.UserDoesNotExistError
                            else -> AuthError.CannotAddNewUserError(err)
                        }
                    }
                    .map { newUser ->
                        usersService.setPassword(
                            newUser,
                            password,
                        ).mapError { err: SetPasswordError -> AuthError.CannotSetPasswordError(err) }
                    }
                    .flatten()
                    .map { createSession(it) }
            }

            !user.hasPasswordSet -> {
                logger.info { "User '${user.data.name}' is logging in for the first time." }
                usersService.setPassword(user, password)
                    .map { createSession(it) }
                    .mapError { AuthError.CannotSetPasswordError(it) }
            }

            else -> {
                if (usersService.checkPassword(user, password)) {
                    logger.info { "User '${user.data.name}' logged in." }
                    usersService.updateLastLoginDate(user)
                    Ok(createSession(user))
                } else {
                    logger.info { "User '${user.data.name}' tried to log in, but provided wrong password." }
                    Err(AuthError.BadCredentialsError)
                }
            }
        }
    }

    suspend fun authenticateWithApiToken(token: String): UserSession? {
        return usersService.getByApiToken(token)?.let { createSession(it) }
    }

    private fun createSession(user: User): UserSession {
        val scopes = user.data.roles.map { it.scopes }.flatten().toSet()
        return UserSession(
            name = user.data.name,
            scopes = scopes.map { it.value },
            validationToken = user.data.sessionValidationToken,
        )
    }
}

sealed class AuthError {
    data class CannotSetPasswordError(val setPasswordError: SetPasswordError) : AuthError()
    data class CannotAddNewUserError(val addNewUserError: AddNewUserError) : AuthError()
    data object UserDoesNotExistError : AuthError()
    data object BadCredentialsError : AuthError()
}
