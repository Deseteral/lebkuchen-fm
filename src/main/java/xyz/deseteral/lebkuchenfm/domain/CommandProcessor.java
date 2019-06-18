package xyz.deseteral.lebkuchenfm.domain;

import java.util.List;
import java.util.Optional;

interface CommandProcessor {
    CommandProcessingResponse process(List<String> args);

    String getKey();

    Optional<String> getShortKey();

    String getHelpMessage();
}
