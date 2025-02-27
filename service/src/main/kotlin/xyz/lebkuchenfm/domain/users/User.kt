package xyz.lebkuchenfm.domain.users

import kotlinx.datetime.Instant
import xyz.lebkuchenfm.domain.security.HashedPasswordHexEncoded

data class User(
    val data: UserData,
    val secret: UserSecret?,
) {
    val hasPasswordSet: Boolean get() = secret != null

    data class UserData(
        val name: UserName,
        val discordId: String?,
        val creationDate: Instant,
        val lastLoggedIn: Instant,
    )

    data class UserSecret(
        val hashedPassword: HashedPasswordHexEncoded,
        val salt: String,
        val apiToken: String,
    )
}

@JvmInline
value class UserName(val value: String) {
    override fun toString() = value
}
