package xyz.lebkuchenfm.domain.users

import com.github.michaelbull.result.Result
import kotlinx.datetime.Instant
import xyz.lebkuchenfm.domain.auth.Role

interface UsersRepository {
    suspend fun findAll(): List<User>
    suspend fun findByName(username: String): User?
    suspend fun findByApiToken(token: String): User?
    suspend fun findByDiscordId(discordId: String): User?
    suspend fun insert(user: User): Result<User, InsertUserError>
    suspend fun insertFirstUser(user: User): Result<User, InsertFirstUserError>
    suspend fun updateLastLoginDate(user: User, date: Instant): User?
    suspend fun updateSecret(user: User, secret: User.UserSecret): Result<User, UpdateSecretError>
    suspend fun updateRoles(user: User, roles: Set<Role>): Result<User, UpdateRoleError>
}

sealed class InsertUserError {
    data object UserAlreadyExists : InsertUserError()
    data object WriteError : InsertUserError()
}

sealed class InsertFirstUserError {
    data object NotFirstUser : InsertFirstUserError()
    data object UserAlreadyExists : InsertFirstUserError()
    data object WriteError : InsertFirstUserError()
}

sealed class UpdateSecretError {
    data object UserNotFound : UpdateSecretError()
    data object WriteError : UpdateSecretError()
}

sealed class UpdateRoleError {
    data object UserNotFound : UpdateRoleError()
    data object AtLeastOneOwnerMustExist : UpdateRoleError()
    data object WriteError : UpdateRoleError()
}
