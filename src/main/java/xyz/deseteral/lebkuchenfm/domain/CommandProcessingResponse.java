package xyz.deseteral.lebkuchenfm.domain;

public class CommandProcessingResponse {
    private final String response;

    public CommandProcessingResponse(String response) {
        this.response = response;
    }

    public String getResponse() {
        return response;
    }
}
