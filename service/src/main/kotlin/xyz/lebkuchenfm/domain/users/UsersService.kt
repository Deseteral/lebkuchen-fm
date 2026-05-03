package xyz.lebkuchenfm.domain.users

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.andThen
import com.github.michaelbull.result.mapError
import com.github.michaelbull.result.onSuccess
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.datetime.Clock
import xyz.lebkuchenfm.domain.auth.Role
import xyz.lebkuchenfm.domain.security.PasswordEncoder
import xyz.lebkuchenfm.domain.security.SecureGenerator

private val logger = KotlinLogging.logger {}

class UsersService(
    private val repository: UsersRepository,
    private val passwordEncoder: PasswordEncoder,
    private val secureGenerator: SecureGenerator,
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

    suspend fun addNewUser(
        username: String,
        discordId: String? = null,
        roles: Set<Role> = emptySet(),
    ): Result<User, AddNewUserError> {
        val now = clock.now()
        val user = User(
            data = User.UserData(
                name = username,
                discordId = discordId,
                creationDate = now,
                lastLoggedIn = now,
                roles = roles,
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

    suspend fun createFirstUser(username: String, password: String): Result<User, CreateFirstUserError> {
        return createUserSecret(password)
            .mapError { CreateFirstUserError.PasswordValidationError(it) }
            .andThen { secret ->
                val now = clock.now()
                val user = User(
                    data = User.UserData(
                        name = username,
                        discordId = null,
                        creationDate = now,
                        lastLoggedIn = now,
                        roles = setOf(Role.OWNER),
                    ),
                    secret = secret,
                )

                repository.insertFirstUser(user)
                    .onSuccess { logger.info { "Created first user '${it.data.name}' with OWNER role." } }
                    .mapError {
                        when (it) {
                            InsertFirstUserError.UsersAlreadyExist -> CreateFirstUserError.UsersAlreadyExist
                            InsertFirstUserError.WriteError -> CreateFirstUserError.UnknownError
                        }
                    }
            }
    }

    suspend fun assignOwnerToOldestUserIfNoneExists() {
        val owners = repository.findByRole(Role.OWNER)
        if (owners.isNotEmpty()) return

        val oldestUser = repository.findOldestUser() ?: return
        val updatedRoles = oldestUser.data.roles + Role.OWNER

        repository.updateRoles(oldestUser, updatedRoles)
            .onSuccess { logger.info { "Assigned OWNER role to oldest user '${it.data.name}'." } }
    }

    fun checkPassword(user: User, password: String): Boolean {
        if (user.secret == null) {
            return false
        }

        val hash = passwordEncoder.encode(password, user.secret.salt)
        return hash == user.secret.hashedPassword
    }

    suspend fun setPassword(user: User, password: String): Result<User, SetPasswordError> {
        return createUserSecret(password)
            .andThen { secret ->
                repository.updateSecret(user, secret)
                    .onSuccess { logger.info { "User '${user.data.name}' set new password." } }
                    .mapError {
                        when (it) {
                            UpdateSecretError.UserNotFound -> {
                                logger.error {
                                    "Tried to update user '${user.data.name} secret, but that user doesn't exist."
                                }
                                SetPasswordError.UserDoesNotExist
                            }
                            UpdateSecretError.WriteError -> SetPasswordError.UnknownError
                        }
                    }
            }
    }

    // TODO: Create password validator service.
    private fun createUserSecret(password: String): Result<User.UserSecret, SetPasswordError.ValidationError> {
        if (password.length < 6) {
            return Err(SetPasswordError.ValidationError(tooShort = true))
        }

        val salt = secureGenerator.generateSalt()
        val hashedPassword = passwordEncoder.encode(password, salt)
        val apiToken = secureGenerator.generateApiToken()
        return Ok(User.UserSecret(hashedPassword, salt, apiToken))
    }

    suspend fun updateUserRoles(username: String, newRoles: Set<Role>): Result<User, UpdateUserRolesError> {
        val user = repository.findByName(username)
            ?: return Err(UpdateUserRolesError.UserNotFound)

        if (Role.OWNER in user.data.roles && Role.OWNER !in newRoles) {
            val otherOwners = repository.findByRole(Role.OWNER).filter { it.data.name != username }
            if (otherOwners.isEmpty()) {
                return Err(UpdateUserRolesError.WouldRemoveLastOwner)
            }
        }

        return repository.updateRoles(user, newRoles)
            .onSuccess { logger.info { "Updated roles for user '$username' to $newRoles." } }
            .mapError {
                when (it) {
                    UpdateRolesError.UserNotFound -> UpdateUserRolesError.UserNotFound
                    UpdateRolesError.WriteError -> UpdateUserRolesError.UnknownError
                }
            }
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

sealed class SetPasswordError {
    data class ValidationError(val tooShort: Boolean) : SetPasswordError()
    data object UserDoesNotExist : SetPasswordError()
    data object UnknownError : SetPasswordError()
}

sealed class CreateFirstUserError {
    data class PasswordValidationError(val error: SetPasswordError.ValidationError) : CreateFirstUserError()
    data object UsersAlreadyExist : CreateFirstUserError()
    data object UnknownError : CreateFirstUserError()
}

sealed class UpdateUserRolesError {
    data object UserNotFound : UpdateUserRolesError()
    data object WouldRemoveLastOwner : UpdateUserRolesError()
    data object UnknownError : UpdateUserRolesError()
}
