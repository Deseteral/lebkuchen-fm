package xyz.deseteral.lebkuchenfm.api.commands.text.model

import groovy.json.JsonOutput
import spock.lang.Specification
import spock.lang.Unroll
import xyz.deseteral.lebkuchenfm.domain.commands.NoSuchCommandProcessorException
import xyz.deseteral.lebkuchenfm.domain.commands.model.Command
import xyz.deseteral.lebkuchenfm.domain.commands.model.SingleMessageResponse
import xyz.deseteral.lebkuchenfm.domain.commands.parser.TextIsNotACommandException

import static groovy.json.JsonOutput.toJson

class TextCommandResponseDtoTest extends Specification {
    @Unroll
    def 'should create from #desc'() {
        when:
        def responseDto = new TextCommandResponseDto(value)

        then:
        responseDto.response == expected

        where:
        desc                              | value                                                              || expected
        'string'                          | 'test value'                                                       || 'test value'
        'CommandProcessingResponse'       | new SingleMessageResponse('test value')                            || toJson([blocks:[[type: 'section', fields: [[type: 'plain_text', text: 'test value', emoji: true]]]]])
        'TextIsNotACommandException'      | new TextIsNotACommandException('test value')                       || "Text 'test value' is not a command"
        'NoSuchCommandProcessorException' | new NoSuchCommandProcessorException(new Command('test value', '')) || "Command 'test value' does not exist"
    }
}
