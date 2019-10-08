package xyz.deseteral.lebkuchenfm.api.commands.text;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
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
