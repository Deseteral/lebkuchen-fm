package xyz.deseteral.lebkuchenfm.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class GenericCommandResponseDto {
    private final String response;

    @JsonCreator
    public GenericCommandResponseDto(@JsonProperty("response") String response) {
        this.response = response;
    }

    public String getResponse() {
        return response;
    }
}
