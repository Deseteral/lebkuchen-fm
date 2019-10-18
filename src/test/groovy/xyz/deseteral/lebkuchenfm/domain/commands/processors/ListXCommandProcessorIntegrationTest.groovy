package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.springframework.http.HttpStatus
import xyz.deseteral.lebkuchenfm.IntegrationSpecification

import java.util.stream.Collectors

class ListXCommandProcessorIntegrationTest extends IntegrationSpecification {
    def setup() {
        mongoTemplate.getDb().drop()
    }

    def 'should add new sound'() {
        given:
        def request = textCommandRequest('/fm addx test|testurl.com')

        when:
        def response = restTemplate.exchange(request, String)

        then:
        response.statusCode == HttpStatus.OK

        and:
        def listRequest = textCommandRequest('/fm listx')

        when:
        def listResponse = restTemplate.exchange(listRequest, String)

        then:
        listResponse.statusCode == HttpStatus.OK
        parseJsonText(listResponse.body) == [response: '- test']
    }

    def 'should list all sounds'() {
        given:
        def requests = [
            '/fm addx c-test|testurl-c.com',
            '/fm addx a-test|testurl-a.com',
            '/fm addx d-test|testurl-d.com',
            '/fm addx b-test|testurl-b.com',
        ].stream().map({ it -> textCommandRequest(it) }).collect(Collectors.toList())

        when:
        def responses = requests.stream().map({ it -> restTemplate.exchange(it, String) })

        then:
        responses.forEach({ it -> assert it.statusCode == HttpStatus.OK })

        and:
        def listRequest = textCommandRequest('/fm listx')

        when:
        def listResponse = restTemplate.exchange(listRequest, String)

        then:
        listResponse.statusCode == HttpStatus.OK
        parseJsonText(listResponse.body) == [
            response: """- a-test
                        |- b-test
                        |- c-test
                        |- d-test""".stripMargin()
        ]
    }
}
