package xyz.deseteral.lebkuchenfm.domain.mappers;

import xyz.deseteral.lebkuchenfm.api.commands.TextIsNotACommandException;
import xyz.deseteral.lebkuchenfm.domain.CommandProcessingResponse;
import xyz.deseteral.lebkuchenfm.domain.dto.GenericCommandResponseDto;
import xyz.deseteral.lebkuchenfm.services.commands.NoSuchCommandException;

public class GenericCommandResponseDtoMapper {
    public static GenericCommandResponseDto from(CommandProcessingResponse processingResponse) {
        return new GenericCommandResponseDto(processingResponse.getResponse());
    }

    public static GenericCommandResponseDto from(TextIsNotACommandException exception) {
        return new GenericCommandResponseDto(exception.getMessage());
    }

    public static GenericCommandResponseDto from(NoSuchCommandException exception) {
        return new GenericCommandResponseDto(exception.getMessage());
    }
}
