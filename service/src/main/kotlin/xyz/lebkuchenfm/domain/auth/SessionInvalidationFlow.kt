package xyz.lebkuchenfm.domain.auth

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.flow.map

object SessionInvalidationFlow {
    private val flow = MutableSharedFlow<String>()

    suspend fun emit(userName: String) {
        flow.emit(userName)
    }

    fun subscribe(userName: String): Flow<Unit> {
        return flow.filter { it == userName }.map { }
    }
}
