package xyz.lebkuchenfm.domain.users

interface UsersRepository {
    suspend fun findByName(username: String): User?
}
