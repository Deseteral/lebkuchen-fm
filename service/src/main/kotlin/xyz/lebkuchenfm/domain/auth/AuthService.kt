package xyz.lebkuchenfm.domain.auth

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.users.UsersService

private val logger = KotlinLogging.logger {}

class AuthService(private val usersService: UsersService) {
    fun authenticateWithCredentials(username: String, password: String): UserSession? {
        val user = usersService.getByName(username)

        return when {
            user == null && usersService.getUsersCount() == 0 -> {
                logger.info { "User '$username' is the first user to log in." }

                val newUser = usersService.addNewUser(username)
                usersService.setPassword(newUser, password)
                UserSession(newUser.data.name)
            }

            user == null -> {
                logger.info { "User '$username' tried to log in, but does not exist." }
                null
            }

            !user.hasPasswordSet -> {
                logger.info { "User '${user.data.name}' is logging in for the first time." }

                val userWithPassword = usersService.setPassword(user, password)
                UserSession(userWithPassword.data.name)
            }

            else -> if (usersService.checkPassword(password, user)) {
                logger.info { "User '${user.data.name}' logged in." }

                usersService.updateLastLoginDate(user)
                UserSession(user.data.name)
            } else {
                logger.info { "User '${user.data.name}' tried to log in, but provided wrong password" }
                null
            }
        }
    }

    fun authenticateWithApiToken(token: String): UserSession? {
        // TODO: Actually validate the token.
        return if (token == "1234") {
            UserSession("admin")
        } else {
            null
        }
    }
}
