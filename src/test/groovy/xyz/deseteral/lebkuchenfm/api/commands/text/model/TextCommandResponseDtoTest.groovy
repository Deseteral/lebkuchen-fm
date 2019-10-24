package xyz.deseteral.lebkuchenfm.api.commands.text.model

import spock.lang.Specification
import spock.lang.Unroll
import xyz.deseteral.lebkuchenfm.domain.commands.model.SingleMessageResponse

import static groovy.json.JsonOutput.toJson

class TextCommandResponseDtoTest extends Specification {
    @Unroll
    def 'should create from #desc'() {
        when:
        def responseDto = new TextCommandResponseDto(value)

        then:
        responseDto.blocks == expected.blocks

        where:
        desc                        | value                                   || expected
        'CommandProcessingResponse' | new SingleMessageResponse('test value') || [blocks: [[type: 'section', fields: [[type: 'plain_text', text: 'test value', emoji: true]]]]]
    }
}
