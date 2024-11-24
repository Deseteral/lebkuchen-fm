package xyz.lebkuchenfm.domain.auth

import xyz.lebkuchenfm.domain.users.UsersService

class AuthService(private val usersService: UsersService) {
    fun authenticateWithCredentials(username: String, password: String): UserSession? {
        // TODO: Actually validate the credentials.
        return if (username == "admin" && password == "test") {
            UserSession(username)
        } else {
            null
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
