package xyz.deseteral.lebkuchenfm.api.commands.slack

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import xyz.deseteral.lebkuchenfm.api.commands.slack.model.SlackResponseDto
import xyz.deseteral.lebkuchenfm.domain.commands.CommandExecutorService
import xyz.deseteral.lebkuchenfm.domain.commands.NoSuchCommandProcessorException
import xyz.deseteral.lebkuchenfm.domain.commands.model.SingleMessageResponse
import xyz.deseteral.lebkuchenfm.domain.commands.parser.TextIsNotACommandException

@RestController
internal class SlackCommandController(private val processor: CommandExecutorService) {

    @PostMapping("/commands/slack")
    fun processCommand(@RequestParam command: String, @RequestParam text: String): SlackResponseDto {
        val processingResponse = processor.processFromText("$command $text")
        return SlackResponseDto(processingResponse)
    }

    @ExceptionHandler(NoSuchCommandProcessorException::class)
    @ResponseStatus(HttpStatus.OK)
    fun noSuchCommandExceptionHandler(ex: NoSuchCommandProcessorException): SlackResponseDto {
        return SlackResponseDto(SingleMessageResponse(ex.message.orEmpty()))
    }

    @ExceptionHandler(TextIsNotACommandException::class)
    @ResponseStatus(HttpStatus.OK)
    fun textIsNotACommandExceptionHandler(ex: TextIsNotACommandException): SlackResponseDto {
        return SlackResponseDto(SingleMessageResponse(ex.message.orEmpty()))
    }
}
