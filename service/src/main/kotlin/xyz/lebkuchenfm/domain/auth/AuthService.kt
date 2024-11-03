package xyz.lebkuchenfm.domain.auth

class AuthService {
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
