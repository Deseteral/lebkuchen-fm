package xyz.lebkuchenfm.domain.users

import io.github.oshai.kotlinlogging.KotlinLogging

private val logger = KotlinLogging.logger {}

class UsersService(private val repository: UsersRepository) {
    fun getByName(username: String): User? {
        TODO()
    }

    fun getUsersCount(): Int {
        TODO()
    }

    fun addNewUser(username: String): User {
        TODO()
    }

    fun doesUserExist(username: String): Boolean {
        TODO()
    }

    fun checkPassword(password: String, user: User): Boolean {
        TODO()
    }

    fun setPassword(user: User, password: String): User {
        logger.info { "User '${user.data.name}' set new password." }
        TODO()
    }

    fun updateLastLoginDate(user: User) {
        TODO()
    }
}
