package xyz.deseteral.lebkuchenfm.api.commands;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

final class TextCommandRequestDto {
    private final String text;

    @JsonCreator
    public TextCommandRequestDto(@JsonProperty("text") String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }
}
