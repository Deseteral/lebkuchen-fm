package xyz.deseteral.lebkuchenfm.api.commands.text;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import xyz.deseteral.lebkuchenfm.domain.CommandProcessingResponse;
import xyz.deseteral.lebkuchenfm.domain.NoSuchCommandProcessorException;
import xyz.deseteral.lebkuchenfm.domain.TextIsNotACommandException;

@JsonIgnoreProperties(ignoreUnknown = true)
final class TextCommandResponseDto {
    private final String response;

    @JsonCreator
    TextCommandResponseDto(@JsonProperty("response") String response) {
        this.response = response;
    }

    TextCommandResponseDto(CommandProcessingResponse processingResponse) {
        this.response = processingResponse.getResponse();
    }

    TextCommandResponseDto(TextIsNotACommandException exception) {
        this.response = exception.getMessage();
    }

    TextCommandResponseDto(NoSuchCommandProcessorException exception) {
        this.response = exception.getMessage();
    }

    public String getResponse() {
        return response;
    }
}
