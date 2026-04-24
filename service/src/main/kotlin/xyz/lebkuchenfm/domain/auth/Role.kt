package xyz.lebkuchenfm.domain.auth

enum class Role(val scopes: Set<Scope>) {
    OWNER(Scope.entries.toSet()),
    ;

    companion object {
        fun fromString(value: String): Role? = entries.find { it.name == value }
    }
}
