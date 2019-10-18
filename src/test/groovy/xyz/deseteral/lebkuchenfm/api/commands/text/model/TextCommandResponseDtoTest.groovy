package xyz.deseteral.lebkuchenfm.api.commands.text.model

import spock.lang.Specification
import spock.lang.Unroll
import xyz.deseteral.lebkuchenfm.domain.commands.NoSuchCommandProcessorException
import xyz.deseteral.lebkuchenfm.domain.commands.model.Command
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse
import xyz.deseteral.lebkuchenfm.domain.commands.parser.TextIsNotACommandException

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
        'CommandProcessingResponse'       | new CommandProcessingResponse('test value')                        || 'test value'
        'TextIsNotACommandException'      | new TextIsNotACommandException('test value')                       || "Text 'test value' is not a command"
        'NoSuchCommandProcessorException' | new NoSuchCommandProcessorException(new Command('test value', [])) || "Command 'test value' does not exist"
    }
}
