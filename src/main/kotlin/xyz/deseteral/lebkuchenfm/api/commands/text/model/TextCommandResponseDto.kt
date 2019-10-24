package xyz.deseteral.lebkuchenfm.api.commands.text.model

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.ObjectMapper
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse
import xyz.deseteral.lebkuchenfm.domain.commands.model.MessageType

@JsonIgnoreProperties(ignoreUnknown = true)
internal class TextCommandResponseDto {
    val response: String

    @JsonCreator
    constructor(@JsonProperty("response") response: String) {
        this.response = response
    }

    constructor(processingResponse: CommandProcessingResponse) {
        val blocks = mutableListOf<Map<*, *>>()
        processingResponse.getMessages().forEach {
            when (it.type) {
                MessageType.HEADER -> {
                    blocks.add(mapOf("type" to "divider"))
                    blocks.add(mapOf("type" to "section", "text" to mapOf("type" to "mrkdwn", "text" to "*${it.text}*")))
                }
                MessageType.PLAIN -> {
                    if (blocks.isEmpty() || blocks.last()["fields"] == null) {
                        blocks.add(mapOf("type" to "section", "fields" to mutableListOf<Any>()))
                    }
                    (blocks.last()["fields"] as MutableList<Any>).add(mapOf("type" to "plain_text", "text" to it.text, "emoji" to true))
                }
            }
        }
        this.response = ObjectMapper().writeValueAsString(mapOf("blocks" to blocks))
    }

    constructor(exception: Exception) {
        this.response = exception.message.toString()
    }
}

