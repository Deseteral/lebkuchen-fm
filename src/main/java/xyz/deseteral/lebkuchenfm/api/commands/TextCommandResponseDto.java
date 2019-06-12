package xyz.deseteral.lebkuchenfm.api.commands;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

final class TextCommandResponseDto {
    private final String response;

    @JsonCreator
    public TextCommandResponseDto(@JsonProperty("response") String response) {
        this.response = response;
    }

    public String getResponse() {
        return response;
    }
}
