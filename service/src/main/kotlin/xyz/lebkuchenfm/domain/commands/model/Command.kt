package xyz.lebkuchenfm.domain.commands.model

data class Command(
    val key: String,
    val rawArgs: String?,
) {
    fun getArgsByDelimiter(delimiter: String): List<String> {
        return rawArgs
            ?.split(delimiter)
            ?.map { it.trim() }
            ?.filter { it.isNotEmpty() }
            ?: emptyList()
    }
}
