package xyz.lebkuchenfm.domain.users

import kotlinx.datetime.Instant
import xyz.lebkuchenfm.domain.auth.Role
import xyz.lebkuchenfm.domain.auth.Scope
import xyz.lebkuchenfm.domain.security.HashedPasswordHexEncoded

data class User(
    val data: UserData,
    val secret: UserSecret?,
) {
    val hasPasswordSet: Boolean get() = secret != null

    val effectiveScopes: Set<Scope>
        get() = data.roles.flatMapTo(mutableSetOf()) { it.scopes }

    data class UserData(
        val name: String,
        val discordId: String?,
        val creationDate: Instant,
        val lastLoggedIn: Instant,
        val roles: Set<Role> = emptySet(),
    )

    data class UserSecret(
        val hashedPassword: HashedPasswordHexEncoded,
        val salt: String,
        val apiToken: String,
    )
}
