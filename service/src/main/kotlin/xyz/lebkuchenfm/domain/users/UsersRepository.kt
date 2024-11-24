package xyz.lebkuchenfm.domain.users

import kotlinx.datetime.Instant

interface UsersRepository {
    suspend fun findByName(username: String): User?
    suspend fun countUsers(): Long
    suspend fun findByApiToken(token: String): User?
    suspend fun updateLastLoginDate(user: User, date: Instant): User?
}
