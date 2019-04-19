package xyz.deseteral.lebkuchenfm.domain;

public class GenericCommandResponseDto {
    private final String response;

    public GenericCommandResponseDto(String response) {
        this.response = response;
    }

    public String getResponse() {
        return response;
    }
}
