package xyz.deseteral.lebkuchenfm.domain.x

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "x")
data class XSound(
    @Id
    val id: String,
    val name: String,
    val url: String,
    val timesPlayed: Int
)
