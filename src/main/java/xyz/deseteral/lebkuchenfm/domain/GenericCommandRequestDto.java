package xyz.deseteral.lebkuchenfm.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class GenericCommandRequestDto {
    private final String text;

    @JsonCreator
    public GenericCommandRequestDto(@JsonProperty("text") String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }
}
