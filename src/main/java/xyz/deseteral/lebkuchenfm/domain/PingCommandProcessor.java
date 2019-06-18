package xyz.deseteral.lebkuchenfm.domain;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
class PingCommandProcessor implements CommandProcessor {
    @Override
    public CommandProcessingResponse process(List<String> args) {
        return new CommandProcessingResponse("pong");
    }

    @Override
    public String getKey() {
        return "ping";
    }

    @Override
    public Optional<String> getShortKey() {
        return Optional.empty();
    }

    @Override
    public String getHelpMessage() {
        return "Ping pongs you";
    }
}
