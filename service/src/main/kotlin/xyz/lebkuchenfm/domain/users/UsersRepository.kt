package xyz.lebkuchenfm.domain.users

import com.github.michaelbull.result.Result
import kotlinx.datetime.Instant
import xyz.lebkuchenfm.domain.auth.Role

interface UsersRepository {
    suspend fun findAll(): List<User>
    suspend fun findByName(username: String): User?
    suspend fun findByApiToken(token: String): User?
    suspend fun findByDiscordId(discordId: String): User?
    suspend fun findOldestUser(): User?
    suspend fun findByRole(role: Role): List<User>
    suspend fun countUsers(): Long
    suspend fun insert(user: User): Result<User, InsertUserError>
    suspend fun updateLastLoginDate(user: User, date: Instant): User?
    suspend fun updateSecret(user: User, secret: User.UserSecret): Result<User, UpdateSecretError>
    suspend fun updateRoles(user: User, roles: Set<Role>): Result<User, UpdateRolesError>
}

sealed class InsertUserError {
    data object UserAlreadyExists : InsertUserError()
    data object WriteError : InsertUserError()
}

sealed class UpdateSecretError {
    data object UserNotFound : UpdateSecretError()
    data object WriteError : UpdateSecretError()
}

sealed class UpdateRolesError {
    data object UserNotFound : UpdateRolesError()
    data object WriteError : UpdateRolesError()
}
