package xyz.lebkuchenfm.domain.xsounds

data class XSound(
    val name: String,
    // TODO: This should be a URL type.
    val url: String,
    val addedBy: String?,
    val timesPlayed: Int,
    val tags: List<String>,
)
