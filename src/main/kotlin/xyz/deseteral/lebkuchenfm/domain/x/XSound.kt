package xyz.deseteral.lebkuchenfm.domain.x

import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "xsounds")
data class XSound(
    @Indexed(unique = true)
    val name: String,
    val url: String,
    val timesPlayed: Int
)
