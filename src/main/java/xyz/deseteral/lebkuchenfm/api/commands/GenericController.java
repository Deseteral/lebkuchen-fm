package xyz.deseteral.lebkuchenfm.api.commands;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import xyz.deseteral.lebkuchenfm.domain.Command;
import xyz.deseteral.lebkuchenfm.domain.GenericCommandRequestDto;
import xyz.deseteral.lebkuchenfm.domain.GenericCommandResponseDto;
import xyz.deseteral.lebkuchenfm.services.CommandParser;

import java.util.Optional;

@RestController
public class GenericController {
    private final CommandParser commandParser;

    public GenericController(CommandParser commandParser) {
        this.commandParser = commandParser;
    }

    @PostMapping("/commands/generic")
    GenericCommandResponseDto processCommand(@RequestBody GenericCommandRequestDto commandDto) {
        Optional<Command> command = commandParser.parse(commandDto.getText());

        return new GenericCommandResponseDto("some");
    }
}
