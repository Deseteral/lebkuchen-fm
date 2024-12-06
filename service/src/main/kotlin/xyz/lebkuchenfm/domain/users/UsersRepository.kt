package xyz.lebkuchenfm.domain.users

import com.github.michaelbull.result.Result
import kotlinx.datetime.Instant

interface UsersRepository {
    suspend fun findByName(username: String): User?
    suspend fun findByApiToken(token: String): User?
    suspend fun countUsers(): Long
    suspend fun insert(user: User): Result<User, InsertUserError>
    suspend fun updateLastLoginDate(user: User, date: Instant): User?
    suspend fun updateSecret(user: User, secret: User.UserSecret): Result<User, UpdateSecretError>
}

sealed class InsertUserError {
    data object UserAlreadyExists : InsertUserError()
    data object WriteError : InsertUserError()
}

sealed class UpdateSecretError {
    data object UserNotFound : UpdateSecretError()
    data object WriteError : UpdateSecretError()
}
