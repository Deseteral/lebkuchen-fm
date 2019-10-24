package xyz.deseteral.lebkuchenfm.domain.commands.processors

import groovy.json.DefaultJsonGenerator
import groovy.json.JsonGenerator
import org.springframework.http.HttpStatus
import xyz.deseteral.lebkuchenfm.IntegrationSpecification

import static groovy.json.JsonOutput.toJson

class HelpCommandProcessorIntegrationTest extends IntegrationSpecification {
    def 'should display help message for all commands'() {
        given:
        def request = textCommandRequest('/fm help')

        when:
        def response = restTemplate.exchange(request, Map)

        then:
        response.statusCode == HttpStatus.OK

        def jsonGenerator = new DefaultJsonGenerator(new JsonGenerator.Options().disableUnicodeEscaping());

        def jsonExpected = jsonGenerator.toJson([
            "blocks": [
                [
                    "type": "divider"
                ],
                [
                    "type": "section",
                    "text": [
                        "type": "mrkdwn",
                        "text": "*Lista komend:*"
                    ]
                ],
                [
                    "type": "section",
                    "fields": [
                        [
                            "type": "plain_text",
                            "text": "help: Pokazuje tę wiadomość ;)",
                            "emoji": true
                        ],
                        [
                            "type": "plain_text",
                            "text": "ping [p]: Ping pongs you",
                            "emoji": true
                        ]
                    ]
                ],
            ]
        ])

        response.body.response == jsonExpected
    }
}
