package xyz.deseteral.lebkuchenfm.api.commands;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import xyz.deseteral.lebkuchenfm.domain.dto.GenericCommandRequestDto;
import xyz.deseteral.lebkuchenfm.domain.dto.GenericCommandResponseDto;
import xyz.deseteral.lebkuchenfm.domain.mappers.GenericCommandResponseDtoMapper;
import xyz.deseteral.lebkuchenfm.services.CommandParser;
import xyz.deseteral.lebkuchenfm.services.commands.NoSuchCommandException;
import xyz.deseteral.lebkuchenfm.services.commands.RootCommandProcessor;

@RestController
public class GenericController {
    private final CommandParser parser;
    private final RootCommandProcessor processor;

    public GenericController(CommandParser parser, RootCommandProcessor processor) {
        this.parser = parser;
        this.processor = processor;
    }

    @PostMapping("/commands/generic")
    GenericCommandResponseDto processCommand(@RequestBody GenericCommandRequestDto commandDto) {
        return parser
            .parse(commandDto.getText())
            .map(processor::process)
            .map(GenericCommandResponseDtoMapper::from)
            .orElseThrow(TextIsNotACommandException::new);
    }

    @ExceptionHandler(NoSuchCommandException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public GenericCommandResponseDto noSuchCommandExceptionHandler(NoSuchCommandException ex) {
        return GenericCommandResponseDtoMapper.from(ex);
    }

    @ExceptionHandler(TextIsNotACommandException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public GenericCommandResponseDto textIsNotACommandExceptionHandler(TextIsNotACommandException ex) {
        return GenericCommandResponseDtoMapper.from(ex);
    }
}
