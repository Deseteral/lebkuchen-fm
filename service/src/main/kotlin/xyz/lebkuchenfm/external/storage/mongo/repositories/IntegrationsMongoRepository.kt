package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.serialization.Serializable
import xyz.lebkuchenfm.domain.integrations.DiscordIntegration
import xyz.lebkuchenfm.domain.integrations.DropboxIntegration
import xyz.lebkuchenfm.domain.integrations.Integrations
import xyz.lebkuchenfm.domain.integrations.IntegrationsRepository
import xyz.lebkuchenfm.domain.integrations.IntegrationsRepositoryError
import xyz.lebkuchenfm.domain.integrations.YoutubeIntegration
import xyz.lebkuchenfm.external.security.AesGcmEncryptor

private val logger = KotlinLogging.logger {}

class IntegrationsMongoRepository(
    database: MongoDatabase,
    private val encryptor: AesGcmEncryptor,
) : IntegrationsRepository {
    private val collection = database.getCollection<IntegrationsEntity>("integrations")

    override suspend fun get(): Integrations? {
        return try {
            collection.find(eq("_id", SINGLETON_ID)).firstOrNull()?.toDomain()
        } catch (e: Exception) {
            logger.error(e) { "Failed to read integrations from MongoDB." }
            null
        }
    }

    override suspend fun upsert(integrations: Integrations): Result<Integrations, IntegrationsRepositoryError> {
        return try {
            val entity = integrations.toEntity()
            collection.replaceOne(
                eq("_id", SINGLETON_ID),
                entity,
                ReplaceOptions().upsert(true),
            )
            Ok(integrations)
        } catch (e: Exception) {
            logger.error(e) { "Failed to upsert integrations to MongoDB." }
            Err(IntegrationsRepositoryError.DatabaseError)
        }
    }

    private fun IntegrationsEntity.toDomain(): Integrations {
        return Integrations(
            dropbox = dropbox?.let {
                DropboxIntegration(
                    appKey = it.appKey?.let(encryptor::decrypt),
                    appSecret = it.appSecret?.let(encryptor::decrypt),
                    refreshToken = it.refreshToken?.let(encryptor::decrypt),
                    xSoundsPath = it.xSoundsPath,
                )
            },
            youtube = youtube?.let {
                YoutubeIntegration(
                    apiKey = it.apiKey?.let(encryptor::decrypt),
                )
            },
            discord = discord?.let {
                DiscordIntegration(
                    token = it.token?.let(encryptor::decrypt),
                    channelId = it.channelId,
                    commandPrompt = it.commandPrompt,
                )
            },
        )
    }

    private fun Integrations.toEntity(): IntegrationsEntity {
        return IntegrationsEntity(
            id = SINGLETON_ID,
            dropbox = dropbox?.let {
                DropboxIntegrationEntity(
                    appKey = it.appKey?.let(encryptor::encrypt),
                    appSecret = it.appSecret?.let(encryptor::encrypt),
                    refreshToken = it.refreshToken?.let(encryptor::encrypt),
                    xSoundsPath = it.xSoundsPath,
                )
            },
            youtube = youtube?.let {
                YoutubeIntegrationEntity(
                    apiKey = it.apiKey?.let(encryptor::encrypt),
                )
            },
            discord = discord?.let {
                DiscordIntegrationEntity(
                    token = it.token?.let(encryptor::encrypt),
                    channelId = it.channelId,
                    commandPrompt = it.commandPrompt,
                )
            },
        )
    }

    private companion object {
        const val SINGLETON_ID = "singleton"
    }
}

@Serializable
private data class IntegrationsEntity(
    val id: String,
    val dropbox: DropboxIntegrationEntity? = null,
    val youtube: YoutubeIntegrationEntity? = null,
    val discord: DiscordIntegrationEntity? = null,
)

@Serializable
private data class DropboxIntegrationEntity(
    val appKey: String? = null,
    val appSecret: String? = null,
    val refreshToken: String? = null,
    val xSoundsPath: String? = null,
)

@Serializable
private data class YoutubeIntegrationEntity(
    val apiKey: String? = null,
)

@Serializable
private data class DiscordIntegrationEntity(
    val token: String? = null,
    val channelId: String? = null,
    val commandPrompt: String? = null,
)
