package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.coroutines.runSuspendCatching
import com.github.michaelbull.result.map
import com.github.michaelbull.result.mapError
import com.mongodb.MongoWriteException
import com.mongodb.client.model.Filters.and
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Filters.exists
import com.mongodb.client.model.Filters.ne
import com.mongodb.client.model.FindOneAndUpdateOptions
import com.mongodb.client.model.IndexOptions
import com.mongodb.client.model.Indexes
import com.mongodb.client.model.ReturnDocument
import com.mongodb.client.model.Updates
import com.mongodb.kotlin.client.coroutine.MongoClient
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import org.bson.BsonDateTime
import org.bson.Document
import xyz.lebkuchenfm.domain.auth.Role
import xyz.lebkuchenfm.domain.security.HashedPasswordHexEncoded
import xyz.lebkuchenfm.domain.users.InsertFirstUserError
import xyz.lebkuchenfm.domain.users.InsertUserError
import xyz.lebkuchenfm.domain.users.UpdateRoleError
import xyz.lebkuchenfm.domain.users.UpdateSecretError
import xyz.lebkuchenfm.domain.users.User
import xyz.lebkuchenfm.domain.users.UsersRepository
import xyz.lebkuchenfm.external.storage.mongo.isDuplicateKeyException

private val logger = KotlinLogging.logger {}

class UsersMongoRepository(database: MongoDatabase, private val mongoClient: MongoClient) : UsersRepository {
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

    suspend fun migrateSessionValidationTokens() {
        val fieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::sessionValidationToken.name}"
        val usersWithoutToken = collection.countDocuments(exists(fieldName, false))
        if (usersWithoutToken > 0L) {
            logger.info { "Migrating $usersWithoutToken user(s): adding sessionValidationToken." }
            collection.updateMany(
                exists(fieldName, false),
                listOf(Document("\$set", Document(fieldName, Document("\$toString", "\$_id")))),
            )
        }
    }

    override suspend fun findAll(): List<User> {
        return collection
            .find()
            .map { it.toDomain() }
            .toList()
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

    override suspend fun insertFirstUser(user: User): Result<User, InsertFirstUserError> {
        val session = mongoClient.startSession()

        return try {
            session.startTransaction()

            val count = collection.countDocuments(session)
            if (count > 0L) {
                session.abortTransaction()
                return Err(InsertFirstUserError.NotFirstUser)
            }

            collection.insertOne(session, user.toEntity())
            session.commitTransaction()
            Ok(user)
        } catch (ex: Exception) {
            session.abortTransaction()
            when {
                ex is MongoWriteException && ex.isDuplicateKeyException -> Err(InsertFirstUserError.UserAlreadyExists)
                else -> {
                    logger.error(ex) { "An error occurred while inserting first user." }
                    Err(InsertFirstUserError.WriteError)
                }
            }
        } finally {
            session.close()
        }
    }

    override suspend fun updateLastLoginDate(user: User, date: Instant): User? {
        val nameFieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::name.name}"
        val loginDateFieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::lastLoggedIn.name}"

        return collection.findOneAndUpdate(
            eq(nameFieldName, user.data.name),
            Updates.set(loginDateFieldName, BsonDateTime(date.toEpochMilliseconds())),
            FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER),
        )?.toDomain()
    }

    override suspend fun updateSecret(user: User, secret: User.UserSecret): Result<User, UpdateSecretError> {
        val nameFieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::name.name}"
        val secretFieldName = UserEntity::secret.name
        return try {
            collection.findOneAndUpdate(
                eq(nameFieldName, user.data.name),
                Updates.set(secretFieldName, secret.toEntity()),
                FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER),
            )?.toDomain()?.let { Ok(it) } ?: Err(UpdateSecretError.UserNotFound)
        } catch (ex: Exception) {
            logger.error(ex) { "An error occurred while updating user '${user.data.name}' secret." }
            Err(UpdateSecretError.WriteError)
        }
    }

    override suspend fun updateRoles(user: User, roles: Set<Role>, newSessionValidationToken: String): Result<User, UpdateRoleError> {
        val mongoSession = mongoClient.startSession()

        return try {
            mongoSession.startTransaction()

            val nameFieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::name.name}"
            val rolesFieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::roles.name}"
            val tokenFieldName = "${UserEntity::data.name}.${UserEntity.UserDataEntity::sessionValidationToken.name}"

            if (Role.OWNER !in roles) {
                val otherOwnerExists = collection.countDocuments(
                    mongoSession,
                    and(
                        ne(nameFieldName, user.data.name),
                        eq(rolesFieldName, Role.OWNER.name),
                    ),
                ) > 0

                if (!otherOwnerExists) {
                    mongoSession.abortTransaction()
                    return Err(UpdateRoleError.AtLeastOneOwnerMustExist)
                }
            }

            val updates = Updates.combine(
                Updates.set(rolesFieldName, roles.map { it.name }.toSet()),
                Updates.set(tokenFieldName, newSessionValidationToken),
            )
            val updatedUser = collection.findOneAndUpdate(
                mongoSession,
                eq(nameFieldName, user.data.name),
                updates,
                FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER),
            )

            if (updatedUser == null) {
                mongoSession.abortTransaction()
                Err(UpdateRoleError.UserNotFound)
            } else {
                mongoSession.commitTransaction()
                Ok(updatedUser.toDomain())
            }
        } catch (ex: Exception) {
            mongoSession.abortTransaction()
            logger.error(ex) { "An error occurred while updating user '${user.data.name}' roles." }
            Err(UpdateRoleError.WriteError)
        } finally {
            mongoSession.close()
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
        val roles: Set<String>,
        val sessionValidationToken: String,
        @Contextual val creationDate: Instant,
        @Contextual val lastLoggedIn: Instant,
    ) {
        fun toDomain() = User.UserData(
            name = name,
            discordId = discordId,
            creationDate = creationDate,
            lastLoggedIn = lastLoggedIn,
            roles = roles.mapNotNull { Role.fromString(it) }.toSet(),
            sessionValidationToken = sessionValidationToken,
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
    name = name,
    discordId = discordId,
    creationDate = creationDate,
    lastLoggedIn = lastLoggedIn,
    sessionValidationToken = sessionValidationToken,
    roles = roles.map { it.name }.toSet(),
)

private fun User.UserSecret.toEntity() = UserEntity.UserSecretEntity(
    hashedPassword = hashedPassword.value,
    salt = salt,
    apiToken = apiToken,
)
