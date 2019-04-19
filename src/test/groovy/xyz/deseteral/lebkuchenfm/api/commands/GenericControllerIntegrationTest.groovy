package xyz.deseteral.lebkuchenfm.api.commands

import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.RequestEntity
import xyz.deseteral.lebkuchenfm.IntegrationSpecification
import xyz.deseteral.lebkuchenfm.domain.GenericCommandResponseDto

import static groovy.json.JsonOutput.toJson

class GenericControllerIntegrationTest extends IntegrationSpecification {
    def 'should respond to ping command'() {
        given:
        def body = [text:'/fm ping']
        def request = RequestEntity.post(localUri('/commands/generic'))
            .contentType(MediaType.APPLICATION_JSON)
            .body(toJson(body))

        when:
        def response = restTemplate.exchange(request, GenericCommandResponseDto)

        then:
        response.statusCode == HttpStatus.OK
        response.body.response == 'pong'
    }
}
