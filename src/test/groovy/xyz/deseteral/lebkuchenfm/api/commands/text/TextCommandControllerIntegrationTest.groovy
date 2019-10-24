package xyz.deseteral.lebkuchenfm.api.commands.text

import org.springframework.http.HttpStatus
import xyz.deseteral.lebkuchenfm.IntegrationSpecification

class TextCommandControllerIntegrationTest extends IntegrationSpecification {
    def 'should respond to ping command'() {
        given:
        def request = textCommandRequest('/fm', 'ping')

        when:
        def response = restTemplate.exchange(request, String)

        then:
        response.statusCode == HttpStatus.OK
        parseJsonText(response.body) == [
            blocks: [[
                         type: "section",
                         fields: [[
                                      type: "plain_text",
                                      text: "pong",
                                      emoji: true
                                  ]]
                     ]]
        ]
    }

    def 'should respond to not existing command'() {
        given:
        def request = textCommandRequest('/fm', 'notExisting')

        when:
        def response = restTemplate.exchange(request, String)

        then:
        response.statusCode == HttpStatus.OK
        parseJsonText(response.body) == [
            blocks: [[
                         type: "section",
                         fields: [[
                                      type: "plain_text",
                                      text: "Command 'notExisting' does not exist",
                                      emoji: true
                                  ]]
                     ]]
        ]
    }

    def 'should respond to text that is not a command'() {
        given:
        def request = textCommandRequest('some test string', '')

        when:
        def response = restTemplate.exchange(request, String)

        then:
        response.statusCode == HttpStatus.OK
        parseJsonText(response.body) == [
            blocks: [[
                         type: "section",
                         fields: [[
                                      type: "plain_text",
                                      text: "Text 'some test string ' is not a command",
                                      emoji: true
                                  ]]
                     ]]
        ]
    }
}
