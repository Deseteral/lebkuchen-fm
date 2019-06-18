package xyz.deseteral.lebkuchenfm.domain;

public final class CommandProcessingResponse {
    private final String response;

    CommandProcessingResponse(String response) {
        this.response = response;
    }

    public String getResponse() {
        return response;
    }
}
