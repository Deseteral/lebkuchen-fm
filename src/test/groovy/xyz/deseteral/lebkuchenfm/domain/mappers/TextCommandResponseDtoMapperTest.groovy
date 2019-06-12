package xyz.deseteral.lebkuchenfm.domain.mappers

import spock.lang.Specification
import spock.lang.Unroll
import xyz.deseteral.lebkuchenfm.api.commands.TextCommandResponseDtoMapper
import xyz.deseteral.lebkuchenfm.api.commands.TextIsNotACommandException
import xyz.deseteral.lebkuchenfm.domain.Command
import xyz.deseteral.lebkuchenfm.domain.CommandProcessingResponse
import xyz.deseteral.lebkuchenfm.services.commands.NoSuchCommandException

@Unroll
class TextCommandResponseDtoMapperTest extends Specification {
    def 'should map from #fromTitle to GenericCommandResponseDto'() {
        when:
        def commandResponseDto = TextCommandResponseDtoMapper.from(from)

        then:
        commandResponseDto.response == response

        where:
        fromTitle                     | from                                                   || response
        'CommandProcessingResponse'   | new CommandProcessingResponse('some test response')    || 'some test response'
        'TextIsNotACommand exception' | new TextIsNotACommandException('some text')            || "Text 'some text' is not a command"
        'NoSuchCommand exception'     | new NoSuchCommandException(new Command('testKey', [])) || "Command 'testKey' does not exist"
    }
}
