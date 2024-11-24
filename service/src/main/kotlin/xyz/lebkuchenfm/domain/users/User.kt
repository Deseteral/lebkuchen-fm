package xyz.lebkuchenfm.domain.users

import kotlinx.datetime.Instant

data class User(
    val data: UserData,
    val secret: UserSecret?,
) {
    val hasPasswordSet: Boolean get() = secret != null

    data class UserData(
        val name: String,
        val discordId: String?,
        val creationDate: Instant,
        val lastLoggedIn: Instant,
    )

    data class UserSecret(
        val hashedPassword: String,
        val salt: String,
        val apiToken: String,
    )
}
