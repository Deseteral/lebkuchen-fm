package xyz.deseteral.lebkuchenfm.api.commands.text

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import xyz.deseteral.lebkuchenfm.domain.CommandExecutor
import xyz.deseteral.lebkuchenfm.domain.NoSuchCommandProcessorException
import xyz.deseteral.lebkuchenfm.domain.TextIsNotACommandException

@RestController
internal class TextCommandController(private val processor: CommandExecutor) {

    @PostMapping("/commands/text")
    fun processCommand(@RequestBody commandDto: TextCommandRequestDto): TextCommandResponseDto {
        val processingResponse = processor.processFromText(commandDto.text)
        return TextCommandResponseDto(processingResponse)
    }

    @ExceptionHandler(NoSuchCommandProcessorException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun noSuchCommandExceptionHandler(ex: NoSuchCommandProcessorException): TextCommandResponseDto {
        return TextCommandResponseDto(ex)
    }

    @ExceptionHandler(TextIsNotACommandException::class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    fun textIsNotACommandExceptionHandler(ex: TextIsNotACommandException): TextCommandResponseDto {
        return TextCommandResponseDto(ex)
    }
}
