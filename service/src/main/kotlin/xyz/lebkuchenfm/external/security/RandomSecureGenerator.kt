package xyz.lebkuchenfm.external.security

import xyz.lebkuchenfm.domain.security.SecureGenerator
import java.security.SecureRandom

class RandomSecureGenerator : SecureGenerator {
    private val random = SecureRandom()

    override fun generateSalt(): String = randomStringOfSize(64)
    override fun generateApiToken(): String = randomStringOfSize(32)

    private fun randomStringOfSize(size: Int): String {
        val bytes = ByteArray(size)
        random.nextBytes(bytes)
        return bytes.toString()
    }
}
