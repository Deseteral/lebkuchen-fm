package xyz.lebkuchenfm.domain.users

import com.github.michaelbull.result.Result
import com.github.michaelbull.result.mapError
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.datetime.Clock
import xyz.lebkuchenfm.domain.security.SecureGenerator

private val logger = KotlinLogging.logger {}

class UsersService(
    private val repository: UsersRepository,
    private val passwordEncoder: PasswordEncoder,
    private val secureGenerator: SecureGenerator,
    private val clock: Clock,
) {
    suspend fun getByName(username: String): User? {
        return repository.findByName(username)
    }

    suspend fun getUsersCount(): Long {
        return repository.countUsers()
    }

    suspend fun addNewUser(username: String): Result<User, AddNewUserError> {
        val now = clock.now()
        val user = User(
            data = User.UserData(
                name = username,
                discordId = null,
                creationDate = now,
                lastLoggedIn = now,
            ),
            secret = null,
        )

        return repository.insert(user)
            .mapError {
                when (it) {
                    InsertUserError.UserAlreadyExists -> AddNewUserError.UserAlreadyExists
                    InsertUserError.UnknownError -> {
                        logger.error { "Something went wrong while inserting user into repository." }
                        AddNewUserError.UnknownError
                    }
                }
            }
    }

    suspend fun checkPassword(user: User, password: String): Boolean {
        if (user.secret == null) {
            return false
        }

        val hash = passwordEncoder.encode(password, user.secret.salt)
        return hash == user.secret.hashedPassword
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

sealed class AddNewUserError {
    data object UserAlreadyExists : AddNewUserError()
    data object UnknownError : AddNewUserError()
}
