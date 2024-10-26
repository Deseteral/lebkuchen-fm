package xyz.lebkuchenfm.domain.xsounds

data class XSound(
    val name: String,
    val url: String,
    val addedBy: String?,
    val tags: List<String>,
)
