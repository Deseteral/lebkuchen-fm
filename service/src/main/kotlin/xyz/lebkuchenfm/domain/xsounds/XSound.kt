package xyz.lebkuchenfm.domain.xsounds

typealias XSoundId = String

data class XSound(
    val name: String,
    val url: String,
    val addedBy: String?,
    val tags: List<String>,
)
