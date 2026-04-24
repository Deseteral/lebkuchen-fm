package xyz.lebkuchenfm.domain.auth

enum class Role(val scopes: Set<Scope>) {
    OWNER(Scope.entries.toSet()),
    ;

    companion object {
        private val map = entries.associateBy { it.name }

        fun fromName(value: String): Role? = map[value]
    }
}
