package xyz.deseteral.lebkuchenfm.api.commands.text

import org.springframework.http.HttpStatus
import xyz.deseteral.lebkuchenfm.IntegrationSpecification

class TextCommandControllerIntegrationTest extends IntegrationSpecification {
    def 'should respond to ping command'() {
        given:
        def request = textCommandRequest('/fm ping')

        when:
        def response = restTemplate.exchange(request, String)

        then:
        response.statusCode == HttpStatus.OK
        parseJsonText(response.body) == [response: 'pong']
    }

    def 'should respond to not existing command'() {
        given:
        def request = textCommandRequest('/fm notExisting')

        when:
        def response = restTemplate.exchange(request, String)

        then:
        response.statusCode == HttpStatus.BAD_REQUEST
        parseJsonText(response.body) == [response: "Command 'notExisting' does not exist"]
    }

    def 'should respond to text that is not a command'() {
        given:
        def request = textCommandRequest('some test string')

        when:
        def response = restTemplate.exchange(request, String)

        then:
        response.statusCode == HttpStatus.UNPROCESSABLE_ENTITY
        parseJsonText(response.body) == [response: "Text 'some test string' is not a command"]
    }
}
