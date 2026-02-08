package xyz.lebkuchenfm.domain.users

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.mapError
import com.github.michaelbull.result.onSuccess
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.datetime.Clock
import xyz.lebkuchenfm.domain.auth.Role
import xyz.lebkuchenfm.domain.security.PasswordEncoder
import xyz.lebkuchenfm.domain.security.SecureGenerator
import java.util.UUID

private val logger = KotlinLogging.logger {}

class UsersService(
    private val repository: UsersRepository,
    private val passwordEncoder: PasswordEncoder,
    private val secureGenerator: SecureGenerator,
    private val onUserSessionChanged: suspend ((String) -> Unit),
    private val clock: Clock,
) {
    suspend fun getAll(): List<User> {
        return repository.findAll()
    }

    suspend fun getByName(username: String): User? {
        return repository.findByName(username)
    }

    suspend fun getByDiscordId(discordId: String): User? {
        return repository.findByDiscordId(discordId)
    }

    suspend fun addFirstUser(username: String, discordId: String? = null): Result<User, AddNewUserError> {
        val now = clock.now()
        val user = User(
            data = User.UserData(
                name = username,
                discordId = discordId,
                creationDate = now,
                lastLoggedIn = now,
                roles = setOf(Role.OWNER),
                sessionValidationToken = UUID.randomUUID().toString(),
            ),
            secret = null,
        )

        return repository.insertFirstUser(user)
            .onSuccess { logger.info { "Created first user '${it.data.name}' with Owner role." } }
            .mapError {
                when (it) {
                    InsertFirstUserError.NotFirstUser -> {
                        logger.info { "User '$username' tried to log in, but does not exist." }
                        AddNewUserError.NotFirstUser
                    }
                    InsertFirstUserError.UserAlreadyExists -> {
                        logger.info { "Tried to create a new user '$username', but it already exists." }
                        AddNewUserError.UserAlreadyExists
                    }
                    InsertFirstUserError.WriteError -> {
                        logger.error { "Something went wrong while inserting first user into repository." }
                        AddNewUserError.UnknownError
                    }
                }
            }
    }

    suspend fun addNewUser(
        username: String,
        discordId: String? = null,
        roles: Set<Role>,
    ): Result<User, AddNewUserError> {
        val now = clock.now()
        val user = User(
            data = User.UserData(
                name = username,
                discordId = discordId,
                creationDate = now,
                lastLoggedIn = now,
                roles = roles,
                sessionValidationToken = UUID.randomUUID().toString(),
            ),
            secret = null,
        )

        return repository.insert(user)
            .onSuccess { logger.info { "Created new user '${it.data.name}'." } }
            .mapError {
                when (it) {
                    InsertUserError.UserAlreadyExists -> {
                        logger.info { "Tried to create a new user '${user.data.name}', but it already exists." }
                        AddNewUserError.UserAlreadyExists
                    }
                    InsertUserError.WriteError -> {
                        logger.error { "Something went wrong while inserting user into repository." }
                        AddNewUserError.UnknownError
                    }
                }
            }
    }

    fun checkPassword(user: User, password: String): Boolean {
        if (user.secret == null) {
            return false
        }

        val hash = passwordEncoder.encode(password, user.secret.salt)
        return hash == user.secret.hashedPassword
    }

    suspend fun setPassword(user: User, password: String): Result<User, SetPasswordError> {
        // TODO: Create password validator service.
        if (password.length < 6) {
            return Err(SetPasswordError.ValidationError(tooShort = true))
        }

        val salt = secureGenerator.generateSalt()
        val hashedPassword = passwordEncoder.encode(password, salt)
        val apiToken = secureGenerator.generateApiToken()
        val secret = User.UserSecret(hashedPassword, salt, apiToken)

        return repository.updateSecret(user, secret)
            .onSuccess { logger.info { "User '${user.data.name}' set new password." } }
            .mapError {
                when (it) {
                    UpdateSecretError.UserNotFound -> {
                        logger.error { "Tried to update user '${user.data.name} secret, but that user doesn't exist." }
                        SetPasswordError.UserDoesNotExist
                    }
                    UpdateSecretError.WriteError -> SetPasswordError.UnknownError
                }
            }
    }

    suspend fun updateLastLoginDate(user: User) {
        repository.updateLastLoginDate(user, clock.now())
    }

    suspend fun getByApiToken(token: String): User? {
        return repository.findByApiToken(token)
    }

    suspend fun updateUserRoles(user: User, newRoles: Set<Role>): Result<User, UpdateRoleError> {
        return repository.updateRoles(user, newRoles).onSuccess { onUserSessionChanged.invoke(user.data.name) }
    }
}

sealed class AddNewUserError {
    data object NotFirstUser : AddNewUserError()
    data object UserAlreadyExists : AddNewUserError()
    data object UnknownError : AddNewUserError()
}

sealed class SetPasswordError {
    data class ValidationError(val tooShort: Boolean) : SetPasswordError()
    data object UserDoesNotExist : SetPasswordError()
    data object UnknownError : SetPasswordError()
}
