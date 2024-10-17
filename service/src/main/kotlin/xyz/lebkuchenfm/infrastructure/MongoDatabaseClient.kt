package xyz.lebkuchenfm.infrastructure

import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import com.mongodb.kotlin.client.coroutine.MongoClient
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import io.ktor.server.config.ApplicationConfig

// TODO: Error handling.
object MongoDatabaseClient {
    lateinit var mongoClient: MongoClient

    private const val CONNECTION_STRING_PROPERTY_PATH = "storage.mongodb.connectionString"
    private const val DEFAULT_CONNECTION_STRING = "mongodb://localhost:27017"
    private const val DATABASE_NAME = "lebkuchen-fm"

    fun getDatabase(config: ApplicationConfig): MongoDatabase {
        if (!::mongoClient.isInitialized) {
            mongoClient = connectToMongo(config)
        }
        return mongoClient.getDatabase(DATABASE_NAME)
    }

    private fun connectToMongo(config: ApplicationConfig): MongoClient {
        val mongoConnectionString =
            config.propertyOrNull(CONNECTION_STRING_PROPERTY_PATH)?.getString()
                ?: DEFAULT_CONNECTION_STRING
        val clientSettings =
            MongoClientSettings.builder()
                .applyConnectionString(ConnectionString(mongoConnectionString))
                .build()
        return MongoClient.create(clientSettings)
    }
}
