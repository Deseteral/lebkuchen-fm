package xyz.deseteral.lebkuchenfm.api.xsounds

import org.springframework.http.HttpStatus
import xyz.deseteral.lebkuchenfm.IntegrationSpecification

import java.util.stream.Collectors

class XSoundsControllerIntegrationTest extends IntegrationSpecification {
    def 'should return empty list if there are no sounds'() {
        when:
        def response = restTemplate.getForEntity(localUri('/xsounds'), String)

        then:
        response.statusCode == HttpStatus.OK
        parseJsonText(response.body) == [sounds: []]
    }

    def 'should return list of sounds'() {
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
        def response = restTemplate.getForEntity('/xsounds', String)

        then:
        response.statusCode == HttpStatus.OK
        parseJsonText(response.body) == [
            sounds: [
                [
                    name: 'a-test',
                    url: 'testurl-a.com',
                    timesPlayed: 0,
                ], [
                    name: 'b-test',
                    url: 'testurl-b.com',
                    timesPlayed: 0,
                ], [
                    name: 'c-test',
                    url: 'testurl-c.com',
                    timesPlayed: 0,
                ], [
                    name: 'd-test',
                    url: 'testurl-d.com',
                    timesPlayed: 0,
                ],
            ]
        ]
    }
}
