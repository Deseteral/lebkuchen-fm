package xyz.deseteral.lebkuchenfm.api.xsounds.model

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import xyz.deseteral.lebkuchenfm.domain.x.XSound

@JsonIgnoreProperties(ignoreUnknown = true)
data class XSoundsDto(
    val sounds: List<XSound>
)
