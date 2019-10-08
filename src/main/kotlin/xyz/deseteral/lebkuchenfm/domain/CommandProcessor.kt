package xyz.deseteral.lebkuchenfm.domain

interface CommandProcessor {
    val key: String

    val shortKey: String?

    val helpMessage: String
    fun process(args: List<String>): CommandProcessingResponse
}
