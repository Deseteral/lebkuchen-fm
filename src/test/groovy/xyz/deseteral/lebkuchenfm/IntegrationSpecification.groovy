package xyz.deseteral.lebkuchenfm

import groovy.json.DefaultJsonGenerator
import groovy.json.JsonGenerator
import groovy.json.JsonSlurper
import org.bson.Document
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.http.MediaType
import org.springframework.http.RequestEntity
import spock.lang.Specification

import static groovy.json.JsonOutput.toJson

@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
abstract class IntegrationSpecification extends Specification {
    static private final JsonSlurper JSON_SLURPER = new JsonSlurper()
    static private final JSON_GENERATOR = new DefaultJsonGenerator(new JsonGenerator.Options().disableUnicodeEscaping());

    @Value('${local.server.port}')
    protected int port

    @Autowired
    TestRestTemplate restTemplate

    @Autowired
    MongoTemplate mongoTemplate

    def setup() {
        def dropCollectionWithoutDroppingIndexes = { String collectionName ->
            mongoTemplate.getDb().getCollection(collectionName).deleteMany(new Document())
        }

        dropCollectionWithoutDroppingIndexes('xsounds')
    }

    protected URI localUri(String endpoint) {
        return new URI("http://localhost:$port$endpoint")
    }

    protected RequestEntity textCommandRequest(String command) {
        def body = [text: command]
        return RequestEntity.post(localUri('/commands/text'))
            .contentType(MediaType.APPLICATION_JSON)
            .body(toJson(body))
    }

    protected static Object parseJsonText(String string) {
        return JSON_SLURPER.parseText(string)
    }

    protected static toJson(Object obj) {
        return JSON_GENERATOR.toJson(obj)
    }
}
