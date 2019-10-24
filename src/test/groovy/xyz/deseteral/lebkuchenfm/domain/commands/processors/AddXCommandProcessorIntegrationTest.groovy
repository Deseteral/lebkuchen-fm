package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.springframework.http.HttpStatus
import xyz.deseteral.lebkuchenfm.IntegrationSpecification

class AddXCommandProcessorIntegrationTest extends IntegrationSpecification {
    def "should add sound with spaces in it's name"() {
        given:
        def firstAddRequest = textCommandRequest('/fm', 'addx super test sound|super-test-sound.com')

        when:
        def firstAddResponse = restTemplate.exchange(firstAddRequest, String)

        then:
        firstAddResponse.statusCode == HttpStatus.OK
        parseJsonText(firstAddResponse.body) == [
            blocks: [
                [
                    type: 'section',
                    fields: [
                        [
                            type: 'plain_text',
                            text: 'Dodałem efekt "super test sound" do biblioteki!',
                            emoji: true
                        ]
                    ]
                ],
            ]
        ]

        and:
        def listResponse = restTemplate.getForEntity('/xsounds', String)

        then:
        listResponse.statusCode == HttpStatus.OK
        parseJsonText(listResponse.body) == [
            sounds: [
                [
                    name: 'super test sound',
                    url: 'super-test-sound.com',
                    playCount: 0,
                ]
            ]
        ]
    }

    def 'should not add sounds with the same name'() {
        given:
        def firstAddRequest = textCommandRequest('/fm', 'addx test|first-url.com')

        when:
        def firstAddResponse = restTemplate.exchange(firstAddRequest, String)

        then:
        firstAddResponse.statusCode == HttpStatus.OK
        parseJsonText(firstAddResponse.body) == [
            blocks: [
                [
                    type: 'section',
                    fields: [
                        [
                            type: 'plain_text',
                            text: 'Dodałem efekt "test" do biblioteki!',
                            emoji: true
                        ]
                    ]
                ],
            ]
        ]

        and:
        def secondAddRequest = textCommandRequest('/fm', 'addx test|second-url.com')

        when:
        def secondAddResponse = restTemplate.exchange(secondAddRequest, String)

        then:
        secondAddResponse.statusCode == HttpStatus.OK
        parseJsonText(secondAddResponse.body) == [
            blocks: [
                [
                    type: 'section',
                    fields: [
                        [
                            type: 'plain_text',
                            text: 'Dźwięk "test" już istnieje. Wybierz inną nazwę, albo zastanów się co robisz.',
                            emoji: true
                        ]
                    ]
                ],
            ]
        ]

        and:
        def listResponse = restTemplate.getForEntity('/xsounds', String)

        then:
        listResponse.statusCode == HttpStatus.OK
        parseJsonText(listResponse.body) == [
            sounds: [
                [
                    name: 'test',
                    url: 'first-url.com',
                    playCount: 0,
                ]
            ]
        ]
    }
}
