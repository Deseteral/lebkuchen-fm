package xyz.lebkuchenfm.domain.auth

import com.github.michaelbull.result.flatten
import com.github.michaelbull.result.getOr
import com.github.michaelbull.result.map
import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.users.UsersService

private val logger = KotlinLogging.logger {}

class AuthService(private val usersService: UsersService) {
    suspend fun authenticateWithCredentials(username: String, password: String): UserSession? {
        val user = usersService.getByName(username)

        return when {
            user == null && usersService.getUsersCount() == 0L -> {
                logger.info { "User '$username' is the first user to log in." }
                // TODO: Handle errors (probably just present them to the user).
                usersService.addNewUser(username)
                    .map { usersService.setPassword(it, password) }
                    .flatten()
                    .getOr(null)
                    ?.let { UserSession(it.data.name) }
            }

            user == null -> {
                logger.info { "User '$username' tried to log in, but does not exist." }
                null
            }

            !user.hasPasswordSet -> {
                logger.info { "User '${user.data.name}' is logging in for the first time." }
                // TODO: Handle errors (probably just present them to the user).
                usersService.setPassword(user, password)
                    .map { UserSession(it.data.name) }
                    .getOr(null)
            }

            else -> {
                if (usersService.checkPassword(user, password)) {
                    logger.info { "User '${user.data.name}' logged in." }
                    usersService.updateLastLoginDate(user)
                    UserSession(user.data.name)
                } else {
                    logger.info { "User '${user.data.name}' tried to log in, but provided wrong password." }
                    null
                }
            }
        }
    }

    suspend fun authenticateWithApiToken(token: String): UserSession? {
        return usersService.getByApiToken(token)?.let { UserSession(it.data.name) }
    }
}
