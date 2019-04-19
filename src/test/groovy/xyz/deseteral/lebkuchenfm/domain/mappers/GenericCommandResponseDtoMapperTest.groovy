package xyz.deseteral.lebkuchenfm.domain.mappers

import spock.lang.Specification
import xyz.deseteral.lebkuchenfm.domain.CommandProcessingResponse

class GenericCommandResponseDtoMapperTest extends Specification {
    def 'should map from CommandProcessingResponse to GenericCommandResponseDto'() {
        given:
        def processingResponse = new CommandProcessingResponse('some test response')

        when:
        def commandResponseDto = GenericCommandResponseDtoMapper.from(processingResponse)

        then:
        commandResponseDto.response == 'some test response'
    }
}
