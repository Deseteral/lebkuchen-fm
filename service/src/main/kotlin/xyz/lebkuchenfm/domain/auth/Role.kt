package xyz.lebkuchenfm.domain.auth

data class Role(
    val name: String,
    val scopes: Set<Scope>,
) {
    companion object {
        val OWNER = Role(
            name = "Owner",
            scopes = Scope.ALL,
        )

        val ADMIN = Role(
            name = "Admin",
            scopes = setOf(
                Scope.USERS_ADD,
                Scope.USERS_DELETE,
                Scope.USERS_LIST,
                Scope.USERS_MANAGE_ROLES,
            ),
        )

        val DJ = Role(
            name = "DJ",
            scopes = setOf(
                Scope.USERS_LIST,
                Scope.PLAYER_QUEUE,
                Scope.PLAYER_CONTROL,
                Scope.XSOUNDS_PLAY,
                Scope.XSOUNDS_UPLOAD,
                Scope.XSOUNDS_MANAGE_TAGS,
            ),
        )

        val LISTENER = Role(
            name = "Listener",
            scopes = setOf(),
        )

        val all = listOf(OWNER, ADMIN, DJ, LISTENER)
        fun fromString(string: String): Role? {
            return all.find { it.name == string }
        }
    }
}
