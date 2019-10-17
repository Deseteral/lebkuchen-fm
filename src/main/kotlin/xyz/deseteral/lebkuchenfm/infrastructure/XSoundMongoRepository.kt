package xyz.deseteral.lebkuchenfm.infrastructure

import org.springframework.data.mongodb.core.MongoOperations
import org.springframework.stereotype.Repository
import xyz.deseteral.lebkuchenfm.domain.x.XSound
import xyz.deseteral.lebkuchenfm.domain.x.XSoundRepository

@Repository
class XSoundMongoRepository(private val mongoOperations: MongoOperations) : XSoundRepository {
    override fun findAll(): List<XSound> {

    }

    override fun findByName(name: String): XSound? {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun save(xSound: XSound) {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }
}
