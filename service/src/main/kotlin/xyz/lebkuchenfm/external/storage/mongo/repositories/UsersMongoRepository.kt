package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Updates
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.users.User
import xyz.lebkuchenfm.domain.users.UsersRepository

class UsersMongoRepository(database: MongoDatabase) : UsersRepository {
    private val collection = database.getCollection<UserEntity>("users")

    suspend fun createUniqueIndex() {
        val fieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::name.name}"
        val index = Indexes.ascending(fieldName)
        val options = IndexOptions().unique(true).name("unique_data_name")
        collection.createIndex(index, options)
    }

    override suspend fun findByName(username: String): User? {
        val fieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::name.name}"
        return collection
            .find(eq(fieldName, username))
            .firstOrNull()
            ?.toDomain()
    }

    override suspend fun countUsers(): Long {
        return collection.countDocuments()
    }

    override suspend fun findByApiToken(token: String): User? {
        val fieldName = "${UserEntity::data.name}.${UserEntity.UserSecretEntity::apiToken.name}"
        return collection
            .find(eq(fieldName, token))
            .firstOrNull()
            ?.toDomain()
    }

    override suspend fun updateLastLoginDate(user: User, date: Instant): User? {
        val nameFieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::name.name}"
        val loginDateFieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::lastLoggedIn.name}"
        return collection.findOneAndUpdate(
            eq(nameFieldName, user.data.name),
            Updates.set(loginDateFieldName, date),
        )?.toDomain()
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
