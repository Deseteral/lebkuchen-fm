package xyz.deseteral.lebkuchenfm.domain

import java.util.Optional

internal interface CommandProcessor {

    val key: String

    val shortKey: Optional<String>

    val helpMessage: String
    fun process(args: List<String>): CommandProcessingResponse
}
