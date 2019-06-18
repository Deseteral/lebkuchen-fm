package xyz.deseteral.lebkuchenfm.api.commands.text;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import xyz.deseteral.lebkuchenfm.domain.CommandProcessingResponse;
import xyz.deseteral.lebkuchenfm.domain.CommandExecutor;
import xyz.deseteral.lebkuchenfm.domain.TextIsNotACommandException;
import xyz.deseteral.lebkuchenfm.domain.NoSuchCommandProcessorException;

@RestController
final class TextCommandController {
    private final CommandExecutor processor;

    TextCommandController(CommandExecutor processor) {
        this.processor = processor;
    }

    @PostMapping("/commands/text")
    public TextCommandResponseDto processCommand(@RequestBody TextCommandRequestDto commandDto) {
        CommandProcessingResponse processingResponse = processor.processFromText(commandDto.getText());
        return TextCommandResponseDtoMapper.from(processingResponse);
    }

    @ExceptionHandler(NoSuchCommandProcessorException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public TextCommandResponseDto noSuchCommandExceptionHandler(NoSuchCommandProcessorException ex) {
        return TextCommandResponseDtoMapper.from(ex);
    }

    @ExceptionHandler(TextIsNotACommandException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public TextCommandResponseDto textIsNotACommandExceptionHandler(TextIsNotACommandException ex) {
        return TextCommandResponseDtoMapper.from(ex);
    }
}
