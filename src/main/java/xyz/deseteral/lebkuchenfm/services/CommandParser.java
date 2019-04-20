package xyz.deseteral.lebkuchenfm.services;

import org.springframework.stereotype.Component;
import xyz.deseteral.lebkuchenfm.domain.Command;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class CommandParser {
    public Optional<Command> parse(String text) {
        final String parsableText = Optional.ofNullable(text).orElse("");
        final List<String> tokens = Arrays
            .stream(parsableText.split(" "))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .collect(Collectors.toList());

        if (tokens.isEmpty() || !tokens.get(0).equals("/fm")) {
            return Optional.empty();
        }

        final String key = tokens.get(1);
        final List<String> args = tokens.subList(2, tokens.size());

        return Optional.of(new Command(key, args));
    }
}
