package xyz.deseteral.lebkuchenfm.api.commands.text;

import xyz.deseteral.lebkuchenfm.domain.CommandProcessingResponse;
import xyz.deseteral.lebkuchenfm.domain.TextIsNotACommandException;
import xyz.deseteral.lebkuchenfm.domain.NoSuchCommandException;

final class TextCommandResponseDtoMapper {
    public static TextCommandResponseDto from(CommandProcessingResponse processingResponse) {
        return new TextCommandResponseDto(processingResponse.getResponse());
    }

    public static TextCommandResponseDto from(TextIsNotACommandException exception) {
        return new TextCommandResponseDto(exception.getMessage());
    }

    public static TextCommandResponseDto from(NoSuchCommandException exception) {
        return new TextCommandResponseDto(exception.getMessage());
    }
}
