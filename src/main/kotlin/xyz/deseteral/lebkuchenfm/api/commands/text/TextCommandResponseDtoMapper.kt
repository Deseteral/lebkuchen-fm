package xyz.deseteral.lebkuchenfm.api.commands.text

import xyz.deseteral.lebkuchenfm.domain.CommandProcessingResponse
import xyz.deseteral.lebkuchenfm.domain.TextIsNotACommandException
import xyz.deseteral.lebkuchenfm.domain.NoSuchCommandProcessorException

internal object TextCommandResponseDtoMapper {
    fun from(processingResponse: CommandProcessingResponse): TextCommandResponseDto {
        return TextCommandResponseDto(processingResponse.response)
    }

    fun from(exception: TextIsNotACommandException): TextCommandResponseDto {
        return TextCommandResponseDto(exception.message)
    }

    fun from(exception: NoSuchCommandProcessorException): TextCommandResponseDto {
        return TextCommandResponseDto(exception.message)
    }
}
