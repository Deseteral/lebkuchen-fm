package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.springframework.http.HttpStatus
import xyz.deseteral.lebkuchenfm.IntegrationSpecification

import java.util.stream.Collectors

class ListXCommandProcessorIntegrationTest extends IntegrationSpecification {
    def 'should list all sounds'() {
        given:
        def requests = [
            ['/fm', 'addx c-test|testurl-c.com'],
            ['/fm', 'addx a-test|testurl-a.com'],
            ['/fm', 'addx d-test|testurl-d.com'],
            ['/fm', 'addx b-test|testurl-b.com'],
        ].stream().map({ it -> slackCommandRequest(it[0], it[1]) }).collect(Collectors.toList())

        when:
        def responses = requests.stream().map({ it -> restTemplate.exchange(it, String) })

        then:
        responses.forEach({ it -> assert it.statusCode == HttpStatus.OK })

        and:
        def listRequest = slackCommandRequest('/fm', 'listx')

        when:
        def listResponse = restTemplate.exchange(listRequest, String)

        then:
        listResponse.statusCode == HttpStatus.OK
        parseJsonText(listResponse.body) == [
            blocks: [
                [
                    type: "section",
                    fields: [
                        [
                            type: "plain_text",
                            text: "a-test",
                            emoji: true
                        ],
                        [
                            type: "plain_text",
                            text: "b-test",
                            emoji: true
                        ],
                        [
                            type: "plain_text",
                            text: "c-test",
                            emoji: true
                        ],
                        [
                            type: "plain_text",
                            text: "d-test",
                            emoji: true
                        ]
                    ]
                ],
            ]
        ]
    }
}
