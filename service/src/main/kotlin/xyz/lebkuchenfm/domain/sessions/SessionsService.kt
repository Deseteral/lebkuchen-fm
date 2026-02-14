package xyz.lebkuchenfm.domain.sessions

class SessionsService(
    private val repository: SessionsRepository,
) {
    suspend fun deleteAllSessions(userId: String) {
        repository.removeAll(userId)
    }

    suspend fun getUserSessionsIds(userId: String): List<String> {
        return repository.findSessionIdsByUserId(userId)
    }
}
