package xyz.lebkuchenfm.external.security

import java.security.SecureRandom
import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

/**
 * AES-256-GCM authenticated encryption.
 *
 * Stored format: `"<base64(iv)>:<base64(ciphertext+tag)>"`.
 *
 * @param base64Key Base64-encoded 256-bit (32-byte) secret key.
 * @throws IllegalArgumentException if the key is not exactly 32 bytes after decoding.
 */
class AesGcmEncryptor(base64Key: String) {
    private val secretKey: SecretKeySpec

    init {
        val keyBytes = Base64.getDecoder().decode(base64Key)
        require(keyBytes.size == KEY_LENGTH_BYTES) {
            "SECRET_ENCRYPTION_KEY must be exactly $KEY_LENGTH_BYTES bytes (256 bits). " +
                "Got ${keyBytes.size} bytes. Generate one with: openssl rand -base64 32"
        }
        secretKey = SecretKeySpec(keyBytes, "AES")
    }

    fun encrypt(plaintext: String): String {
        val iv = ByteArray(IV_LENGTH_BYTES).also { SecureRandom().nextBytes(it) }
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, GCMParameterSpec(TAG_LENGTH_BITS, iv))
        val ciphertextWithTag = cipher.doFinal(plaintext.toByteArray(Charsets.UTF_8))

        val encoder = Base64.getEncoder()
        return "${encoder.encodeToString(iv)}:${encoder.encodeToString(ciphertextWithTag)}"
    }

    fun decrypt(encoded: String): String {
        val parts = encoded.split(':')
        require(parts.size == 2) { "Invalid encrypted format — expected 'base64(iv):base64(ciphertext+tag)'." }

        val decoder = Base64.getDecoder()
        val iv = decoder.decode(parts[0])
        val ciphertextWithTag = decoder.decode(parts[1])

        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.DECRYPT_MODE, secretKey, GCMParameterSpec(TAG_LENGTH_BITS, iv))
        val plainBytes = cipher.doFinal(ciphertextWithTag)

        return String(plainBytes, Charsets.UTF_8)
    }

    companion object {
        const val CONFIG_PROPERTY_PATH = "security.encryptionKey"

        private const val TRANSFORMATION = "AES/GCM/NoPadding"
        private const val KEY_LENGTH_BYTES = 32
        private const val IV_LENGTH_BYTES = 12
        private const val TAG_LENGTH_BITS = 128
    }
}
