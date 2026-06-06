package xyz.lebkuchenfm.external.security

import java.security.SecureRandom
import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

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
        val ivBase64 = encoder.encodeToString(iv)
        val dataBase64 = encoder.encodeToString(ciphertextWithTag)
        return "$VERSION_PREFIX:$ivBase64:$dataBase64"
    }

    fun decrypt(encoded: String): String {
        val parts = encoded.split(':')
        require(parts.size == 3) {
            "Invalid encrypted format. Expected 'version:base64(iv):base64(ciphertext+tag)' " +
                "(${parts.size} colon-delimited parts found)."
        }

        val version = parts[0]
        require(SUPPORTED_VERSIONS.contains(version)) {
            "Unsupported encryption format version '$version'. " +
                "Supported: ${SUPPORTED_VERSIONS.joinToString(", ")}."
        }

        val decoder = Base64.getDecoder()
        val iv = decoder.decode(parts[1])
        val ciphertextWithTag = decoder.decode(parts[2])

        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.DECRYPT_MODE, secretKey, GCMParameterSpec(TAG_LENGTH_BITS, iv))
        val plainBytes = cipher.doFinal(ciphertextWithTag)

        return String(plainBytes, Charsets.UTF_8)
    }

    companion object {
        const val CONFIG_PROPERTY_PATH = "security.encryptionKey"

        private const val VERSION_PREFIX = "v1"
        private val SUPPORTED_VERSIONS = setOf(VERSION_PREFIX)

        private const val TRANSFORMATION = "AES/GCM/NoPadding"
        private const val KEY_LENGTH_BYTES = 32
        private const val IV_LENGTH_BYTES = 12
        private const val TAG_LENGTH_BITS = 128
    }
}
