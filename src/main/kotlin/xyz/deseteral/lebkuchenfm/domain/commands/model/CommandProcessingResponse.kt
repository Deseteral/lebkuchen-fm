package xyz.deseteral.lebkuchenfm.domain.commands.model

interface CommandProcessingResponse {
    fun getMessages(): Iterable<Message>
}

data class Message(val text: String, val type: MessageType) { }

enum class MessageType {
    HEADER, PLAIN
}

class SingleMessageResponse(private val text: String) : CommandProcessingResponse {
    override fun getMessages(): Iterable<Message> = listOf(Message(text, MessageType.PLAIN))
}
