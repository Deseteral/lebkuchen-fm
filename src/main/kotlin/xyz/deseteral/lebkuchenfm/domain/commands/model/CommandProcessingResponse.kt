package xyz.deseteral.lebkuchenfm.domain.commands.model

interface CommandProcessingResponse {
    fun getMessages(): Iterable<Message>
}

data class Message(val text: String, val type: MessageType)

enum class MessageType {
    HEADER, PLAIN_TEXT
}

class SingleMessageResponse(private val text: String) : CommandProcessingResponse {
    override fun getMessages(): Iterable<Message> = listOf(Message(text, MessageType.PLAIN_TEXT))
}

class MultiMessageResponse(private val list: Iterable<Message>) : CommandProcessingResponse {
    override fun getMessages(): Iterable<Message> = list
}
