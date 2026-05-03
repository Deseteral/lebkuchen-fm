package xyz.lebkuchenfm.domain.auth

enum class Role(val scopes: Set<Scope>) {
    OWNER(Scope.entries.toSet()),
    DJ(
        setOf(
            Scope.PLAYER_PLAYBACK_CONTROL,
            Scope.PLAYER_QUEUE,
            Scope.PLAYER_SKIP,
            Scope.XSOUNDS_PLAY,
            Scope.XSOUNDS_MANAGE,
        ),
    ),
    HONKER(setOf(Scope.PLAYER_PLAYBACK_CONTROL, Scope.XSOUNDS_PLAY)),
    LISTENER(setOf(Scope.PLAYER_PLAYBACK_CONTROL)),
    ;

    companion object {
        private val map = entries.associateBy { it.name }

        fun fromName(value: String): Role? = map[value]
    }
}
