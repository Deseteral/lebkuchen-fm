package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.bson.Document
import org.springframework.http.HttpStatus
import xyz.deseteral.lebkuchenfm.IntegrationSpecification

class AddXCommandProcessorIntegrationTest extends IntegrationSpecification {
    def setup() {
        mongoTemplate.getDb().getCollection("x").deleteMany(new Document())
    }

    def 'should not add sounds with the same name'() {
        given:
        def firstAddRequest = textCommandRequest('/fm addx test|first-url.com')

        when:
        def firstAddResponse = restTemplate.exchange(firstAddRequest, String)

        then:
        firstAddResponse.statusCode == HttpStatus.OK
        parseJsonText(firstAddResponse.body) == [response: 'Dodałem efekt "test" do biblioteki!']

        and:
        def secondAddRequest = textCommandRequest('/fm addx test|second-url.com')

        when:
        def secondAddResponse = restTemplate.exchange(secondAddRequest, String)

        then:
        secondAddResponse.statusCode == HttpStatus.OK
        parseJsonText(secondAddResponse.body) == [
            response: 'Dźwięk "test" już istnieje. Wybierz inną nazwę, albo zastanów się co robisz.'
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
                    timesPlayed: 0,
                ]
            ]
        ]
    }
}