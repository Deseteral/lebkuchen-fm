package xyz.lebkuchenfm.domain.xsounds

data class XSound(
    val name: String,
    val url: String, // TODO: This should be a URL type.
    val addedBy: String?,
    val timesPlayed: Int,
    val tags: List<String>,
)
