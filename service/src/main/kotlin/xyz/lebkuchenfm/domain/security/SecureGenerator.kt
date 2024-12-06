package xyz.lebkuchenfm.domain.security

interface SecureGenerator {
    fun generateSalt(): String
    fun generateApiToken(): String
}
