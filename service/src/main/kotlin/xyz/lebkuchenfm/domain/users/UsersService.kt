package xyz.lebkuchenfm.domain.users

import io.github.oshai.kotlinlogging.KotlinLogging

private val logger = KotlinLogging.logger {}

class UsersService(private val repository: UsersRepository) {
    suspend fun getByName(username: String): User? {
        return repository.findByName(username)
    }

    suspend fun getUsersCount(): Long {
        return repository.countUsers()
    }

    suspend fun addNewUser(username: String): User {
        TODO()
    }

    suspend fun doesUserExist(username: String): Boolean {
        TODO()
    }

    suspend fun checkPassword(user: User, password: String): Boolean {
        TODO()
    }

    suspend fun setPassword(user: User, password: String): User {
        logger.info { "User '${user.data.name}' set new password." }
        TODO()
    }

    suspend fun updateLastLoginDate(user: User) {
        TODO()
    }

    suspend fun getByApiToken(token: String): User? {
        TODO()
    }
}
