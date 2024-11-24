package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.mongodb.client.model.Filters.eq
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.users.User
import xyz.lebkuchenfm.domain.users.UsersRepository

class UsersMongoRepository(database: MongoDatabase) : UsersRepository {
    private val collection = database.getCollection<UserEntity>("users")

    override suspend fun findByName(username: String): User? {
        return collection
            .find(eq(UserEntity::data::name.name, username))
            .firstOrNull()
            ?.toDomain()
    }
}

@Serializable
private data class UserEntity(
    val data: UserDataEntity,
    val secret: UserSecretEntity,
) {
    fun toDomain() = User(data.toDomain(), secret.toDomain())

    @Serializable
    data class UserDataEntity(
        val name: String,
        val discordId: String?,
        @Contextual val creationDate: Instant,
        @Contextual val lastLoggedIn: Instant,
    ) {
        fun toDomain() = User.UserData(name, discordId, creationDate, lastLoggedIn)
    }

    @Serializable
    data class UserSecretEntity(
        val hashedPassword: String,
        val salt: String,
        val apiToken: String,
    ) {
        fun toDomain() = User.UserSecret(hashedPassword, salt, apiToken)
    }
}
