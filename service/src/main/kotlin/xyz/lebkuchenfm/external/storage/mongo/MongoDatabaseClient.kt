package xyz.lebkuchenfm.external.storage.mongo

import com.mongodb.ConnectionString
import com.mongodb.ErrorCategory
import com.mongodb.MongoClientSettings
import com.mongodb.MongoWriteException
import com.mongodb.kotlin.client.coroutine.MongoClient
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import io.ktor.server.config.ApplicationConfig

// TODO: Error handling.
object MongoDatabaseClient {
    lateinit var client: MongoClient

    private const val CONNECTION_STRING_PROPERTY_PATH = "storage.mongodb.connectionString"
    private const val DATABASE_NAME = "lebkuchen-fm" // TODO: This should be configurable.

    fun getDatabase(config: ApplicationConfig): MongoDatabase {
        if (!MongoDatabaseClient::client.isInitialized) {
            client = connectToMongo(config)
        }
        return client.getDatabase(DATABASE_NAME)
    }

    private fun connectToMongo(config: ApplicationConfig): MongoClient {
        val mongoConnectionString = ConnectionString(config.property(CONNECTION_STRING_PROPERTY_PATH).getString())
        val clientSettings = MongoClientSettings.builder().applyConnectionString(mongoConnectionString).build()
        return MongoClient.create(clientSettings)
    }
}

val MongoWriteException.isDuplicateKeyException: Boolean
    get() = this.error.category == ErrorCategory.DUPLICATE_KEY
