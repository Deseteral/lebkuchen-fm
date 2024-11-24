package xyz.lebkuchenfm.domain.users

import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.datetime.Clock

private val logger = KotlinLogging.logger {}

class UsersService(private val repository: UsersRepository, private val clock: Clock) {
    suspend fun getByName(username: String): User? {
        return repository.findByName(username)
    }

    suspend fun getUsersCount(): Long {
        return repository.countUsers()
    }

    suspend fun addNewUser(username: String): User {
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
        repository.updateLastLoginDate(user, clock.now())
    }

    suspend fun getByApiToken(token: String): User? {
        return repository.findByApiToken(token)
    }
}
