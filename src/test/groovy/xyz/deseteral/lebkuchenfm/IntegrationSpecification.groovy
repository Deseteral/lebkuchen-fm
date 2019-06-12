package xyz.deseteral.lebkuchenfm

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.test.annotation.DirtiesContext
import spock.lang.Specification

@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
abstract class IntegrationSpecification extends Specification {

    @Value('${local.server.port}')
    protected int port

    @Autowired
    TestRestTemplate restTemplate

    protected URI localUri(String endpoint) {
        return new URI("http://localhost:$port$endpoint")
    }
}
