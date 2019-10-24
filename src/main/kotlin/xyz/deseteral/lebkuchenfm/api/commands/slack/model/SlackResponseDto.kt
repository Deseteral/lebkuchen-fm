package xyz.deseteral.lebkuchenfm.api.commands.slack.model

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse
import xyz.deseteral.lebkuchenfm.domain.commands.model.MessageType

@JsonIgnoreProperties(ignoreUnknown = true)
internal class SlackResponseDto(processingResponse: CommandProcessingResponse) {
    val blocks: List<Any>

    init {
        val blocks = mutableListOf<Map<*, *>>()
        processingResponse.getMessages().forEach {
            when (it.type) {
                MessageType.HEADER -> {
                    blocks.add(mapOf("type" to "divider"))
                    blocks.add(mapOf("type" to "section", "text" to mapOf("type" to "mrkdwn", "text" to "*${it.text}*")))
                }
                MessageType.PLAIN_TEXT -> {
                    if (blocks.isEmpty() || blocks.last()["fields"] == null) {
                        blocks.add(mapOf("type" to "section", "fields" to mutableListOf<Any>()))
                    }
                    (blocks.last()["fields"] as MutableList<Any>).add(mapOf("type" to "plain_text", "text" to it.text, "emoji" to true))
                }
            }
        }
        this.blocks = blocks
    }
}

