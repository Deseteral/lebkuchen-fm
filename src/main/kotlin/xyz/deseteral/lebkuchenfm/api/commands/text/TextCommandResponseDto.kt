package xyz.deseteral.lebkuchenfm.api.commands.text

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import xyz.deseteral.lebkuchenfm.domain.CommandProcessingResponse
import xyz.deseteral.lebkuchenfm.domain.NoSuchCommandProcessorException
import xyz.deseteral.lebkuchenfm.domain.TextIsNotACommandException

@JsonIgnoreProperties(ignoreUnknown = true)
internal class TextCommandResponseDto {
    val response: String

    @JsonCreator
    constructor(@JsonProperty("response") response: String) {
        this.response = response
    }

    constructor(processingResponse: CommandProcessingResponse) {
        this.response = processingResponse.response
    }

    constructor(exception: TextIsNotACommandException) {
        this.response = exception.message.toString()
    }

    constructor(exception: NoSuchCommandProcessorException) {
        this.response = exception.message.toString()
    }
}
