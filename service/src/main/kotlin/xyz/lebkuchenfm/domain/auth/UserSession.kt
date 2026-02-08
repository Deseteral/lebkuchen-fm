package xyz.lebkuchenfm.domain.auth

import kotlinx.coroutines.channels.BufferOverflow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.filter
import kotlinx.serialization.Serializable
import java.util.UUID

@Serializable
data class UserSession(
    val name: String,
    val scopes: List<String>,
    val validationToken: String = UUID.randomUUID().toString(),
)

object SessionInvalidationFlow {
    private val flow =
        MutableSharedFlow<String>(extraBufferCapacity = 100, onBufferOverflow = BufferOverflow.DROP_OLDEST)

    suspend fun emit(userId: String) {
        flow.emit(userId)
    }

    fun subscribe(userId: String) = flow.filter { it == userId }
}
