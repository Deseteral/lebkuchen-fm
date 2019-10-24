package xyz.deseteral.lebkuchenfm.api.commands.slack.model

import spock.lang.Specification
import spock.lang.Unroll
import xyz.deseteral.lebkuchenfm.domain.commands.model.SingleMessageResponse

class SlackResponseDtoTest extends Specification {
    @Unroll
    def 'should create from #desc'() {
        when:
        def responseDto = new SlackResponseDto(value)

        then:
        responseDto.blocks == expected.blocks

        where:
        desc                        | value                                   || expected
        'CommandProcessingResponse' | new SingleMessageResponse('test value') || [blocks: [[type: 'section', fields: [[type: 'plain_text', text: 'test value', emoji: true]]]]]
    }
}
