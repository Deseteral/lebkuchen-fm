package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.coroutines.runSuspendCatching
import com.github.michaelbull.result.map
import com.github.michaelbull.result.mapError
import com.mongodb.MongoWriteException
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.FindOneAndUpdateOptions
import com.mongodb.client.model.IndexOptions
import com.mongodb.client.model.Indexes
import com.mongodb.client.model.ReturnDocument
import com.mongodb.client.model.Updates
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import org.bson.BsonDateTime
import xyz.lebkuchenfm.domain.security.HashedPasswordHexEncoded
import xyz.lebkuchenfm.domain.users.InsertUserError
import xyz.lebkuchenfm.domain.users.UpdateSecretError
import xyz.lebkuchenfm.domain.users.User
import xyz.lebkuchenfm.domain.users.UserName
import xyz.lebkuchenfm.domain.users.UsersRepository
import xyz.lebkuchenfm.external.storage.mongo.isDuplicateKeyException

private val logger = KotlinLogging.logger {}

class UsersMongoRepository(database: MongoDatabase) : UsersRepository {
    private val collection = database.getCollection<UserEntity>("users")

    suspend fun createUniqueIndex() {
        val fieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::name.name}"
        val index = Indexes.ascending(fieldName)
        val options = IndexOptions().unique(true).name("unique_data_name")

        try {
            collection.createIndex(index, options)
        } catch (ex: Exception) {
            logger.error(ex) { "An error occurred while creating a user repository index." }
            throw ex
        }
    }

    override suspend fun findByName(username: String): User? {
        val fieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::name.name}"
        return collection
            .find(eq(fieldName, username))
            .firstOrNull()
            ?.toDomain()
    }

    override suspend fun findByApiToken(token: String): User? {
        val fieldName = "${UserEntity::secret.name}.${UserEntity.UserSecretEntity::apiToken.name}"
        return collection
            .find(eq(fieldName, token))
            .firstOrNull()
            ?.toDomain()
    }

    override suspend fun findByDiscordId(discordId: String): User? {
        val fieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::discordId.name}"
        return collection
            .find(eq(fieldName, discordId))
            .firstOrNull()
            ?.toDomain()
    }

    override suspend fun countUsers(): Long {
        // We should not return zero on errors here!
        // Returning zero will mean that any credentials will be able to authorize - which is a major breach of security.
        return collection.countDocuments()
    }

    override suspend fun insert(user: User): Result<User, InsertUserError> {
        return runSuspendCatching { collection.insertOne(user.toEntity()) }
            .map { user }
            .mapError { ex ->
                val error = when {
                    ex is MongoWriteException && ex.isDuplicateKeyException -> InsertUserError.UserAlreadyExists
                    else -> {
                        logger.error(ex) { "An error occurred while inserting new user document." }
                        InsertUserError.WriteError
                    }
                }
                return Err(error)
            }
    }

    override suspend fun updateLastLoginDate(user: User, date: Instant): User? {
        val nameFieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::name.name}"
        val loginDateFieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::lastLoggedIn.name}"
        return collection.findOneAndUpdate(
            eq(nameFieldName, user.data.name.value),
            Updates.set(loginDateFieldName, BsonDateTime(date.toEpochMilliseconds())),
            FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER),
        )?.toDomain()
    }

    override suspend fun updateSecret(user: User, secret: User.UserSecret): Result<User, UpdateSecretError> {
        val nameFieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::name.name}"
        val secretFieldName = UserEntity::secret.name
        return try {
            collection.findOneAndUpdate(
                eq(nameFieldName, user.data.name.value),
                Updates.set(secretFieldName, secret.toEntity()),
                FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER),
            )?.toDomain()?.let { Ok(it) } ?: Err(UpdateSecretError.UserNotFound)
        } catch (ex: Exception) {
            logger.error(ex) { "An error occurred while updating user '${user.data.name}' secret." }
            Err(UpdateSecretError.WriteError)
        }
    }
}

@Serializable
private data class UserEntity(
    val data: UserDataEntity,
    val secret: UserSecretEntity?,
) {
    fun toDomain() = User(
        data = data.toDomain(),
        secret = secret?.toDomain(),
    )

    @Serializable
    data class UserDataEntity(
        val name: String,
        val discordId: String?,
        @Contextual val creationDate: Instant,
        @Contextual val lastLoggedIn: Instant,
    ) {
        fun toDomain() = User.UserData(
            name = UserName(name),
            discordId = discordId,
            creationDate = creationDate,
            lastLoggedIn = lastLoggedIn,
        )
    }

    @Serializable
    data class UserSecretEntity(
        val hashedPassword: String,
        val salt: String,
        val apiToken: String,
    ) {
        fun toDomain() = User.UserSecret(
            hashedPassword = HashedPasswordHexEncoded(hashedPassword),
            salt = salt,
            apiToken = apiToken,
        )
    }
}

private fun User.toEntity() = UserEntity(
    data = data.toEntity(),
    secret = secret?.toEntity(),
)

private fun User.UserData.toEntity() = UserEntity.UserDataEntity(
    name = name.value,
    discordId = discordId,
    creationDate = creationDate,
    lastLoggedIn = lastLoggedIn,
)

private fun User.UserSecret.toEntity() = UserEntity.UserSecretEntity(
    hashedPassword = hashedPassword.value,
    salt = salt,
    apiToken = apiToken,
)
