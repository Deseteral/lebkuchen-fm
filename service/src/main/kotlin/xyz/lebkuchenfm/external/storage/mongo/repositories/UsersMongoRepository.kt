package xyz.lebkuchenfm.external.storage.mongo.repositories

import com.mongodb.kotlin.client.coroutine.MongoDatabase
import xyz.lebkuchenfm.domain.users.UsersRepository

class UsersMongoRepository(database: MongoDatabase) : UsersRepository
