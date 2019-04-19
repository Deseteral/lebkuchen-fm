package xyz.deseteral.lebkuchenfm.domain.mappers;

import xyz.deseteral.lebkuchenfm.domain.CommandProcessingResponse;
import xyz.deseteral.lebkuchenfm.domain.GenericCommandResponseDto;

public class GenericCommandResponseDtoMapper {
    public static GenericCommandResponseDto from(CommandProcessingResponse processingResponse) {
        return new GenericCommandResponseDto(processingResponse.getResponse());
    }
}
