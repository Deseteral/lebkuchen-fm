package xyz.lebkuchenfm.domain.sessions

class SessionsService(
    private val repository: SessionsRepository,
) {
    suspend fun removeAllSessionsForUser(userId: String) {
        repository.removeAllByUserId(userId)
    }

    suspend fun getUserSessionIds(userId: String): List<String> {
        return repository.findSessionIdsByUserId(userId)
    }
}
