package xyz.deseteral.lebkuchenfm.api.commands.text

import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.RequestEntity
import xyz.deseteral.lebkuchenfm.IntegrationSpecification

import static groovy.json.JsonOutput.toJson

class TextCommandControllerIntegrationTest extends IntegrationSpecification {
    def 'should respond to ping command'() {
        given:
        def body = [text: '/fm ping']
        def request = RequestEntity.post(localUri('/commands/text'))
            .contentType(MediaType.APPLICATION_JSON)
            .body(toJson(body))

        when:
        def response = restTemplate.exchange(request, Map)

        then:
        response.statusCode == HttpStatus.OK
        response.body.response == toJson([
            blocks: [[
                type: "section",
                fields: [[
                    type: "plain_text",
                    text: "pong",
                    emoji: true
                ]]
            ]]
        ])
    }

    def 'should respond to not existing command'() {
        given:
        def body = [text: '/fm notExisting']
        def request = RequestEntity.post(localUri('/commands/text'))
            .contentType(MediaType.APPLICATION_JSON)
            .body(toJson(body))

        when:
        def response = restTemplate.exchange(request, String)

        then:
        response.statusCode == HttpStatus.BAD_REQUEST
        parseJsonText(response.body) == [response: "Command 'notExisting' does not exist"]
    }

    def 'should respond to text that is not a command'() {
        given:
        def body = [text: 'some test string']
        def request = RequestEntity.post(localUri('/commands/text'))
            .contentType(MediaType.APPLICATION_JSON)
            .body(toJson(body))

        when:
        def response = restTemplate.exchange(request, String)

        then:
        response.statusCode == HttpStatus.UNPROCESSABLE_ENTITY
        parseJsonText(response.body) == [response: "Text 'some test string' is not a command"]
    }
}
