package xyz.deseteral.lebkuchenfm.api.commands.text.model

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class TextCommandRequestDto(val text: String)
