package xyz.lebkuchenfm.external.security

import xyz.lebkuchenfm.domain.security.HashedPasswordHexEncoded
import xyz.lebkuchenfm.domain.security.PasswordEncoder
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec

class Pbkdf2PasswordEncoder : PasswordEncoder {
    private val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512")
    private val iterationCount = 50000
    private val keyLength = 64 * 8

    override fun encode(password: String, salt: String): HashedPasswordHexEncoded {
        val spec = PBEKeySpec(
            password.toCharArray(),
            salt.toByteArray(),
            iterationCount,
            keyLength,
        )
        val hash = factory.generateSecret(spec).encoded
        return HashedPasswordHexEncoded(hash)
    }
}
