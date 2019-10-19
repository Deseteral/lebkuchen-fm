package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.springframework.http.HttpStatus
import xyz.deseteral.lebkuchenfm.IntegrationSpecification

class HelpCommandProcessorIntegrationTest extends IntegrationSpecification {
    def 'should display help message for all commands'() {
        given:
        def request = textCommandRequest('/fm help')

        when:
        def response = restTemplate.exchange(request, String)

        then:
        response.statusCode == HttpStatus.OK
        parseJsonText(response.body) == [
            response: """Lista komend:
                        |- addx: Dodaje efekt dźwiękowy (`addx sound name|url`)
                        |- help: Pokazuje tę wiadomość ;)
                        |- listx: Wypisuje listę czaderskich dźwięków w bazie
                        |- ping [p]: Ping pongs you""".stripMargin()
        ]
    }
}
