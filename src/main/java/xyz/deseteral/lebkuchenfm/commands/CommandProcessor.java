package xyz.deseteral.lebkuchenfm.commands;

import xyz.deseteral.lebkuchenfm.domain.CommandProcessingResponse;

import java.util.List;
import java.util.Optional;

interface CommandProcessor {
    CommandProcessingResponse process(List<String> args);
    String getKey();
    Optional<String> getShortKey();
    String getHelpMessage();
}
