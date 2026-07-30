package xyz.lebkuchenfm.external.security

import javax.crypto.AEADBadTagException
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNotEquals

class AesGcmCipherTest {

    private val validKey = "Vqq6vLMPJ+o3LQVOxD0awg3nVx4YFF9kZ9p2Jx6M9kE="

    @Test
    fun `encrypt then decrypt returns original`() {
        // given
        val cipher = AesGcmCipher(validKey)
        val original = "hello world"

        // when
        val encrypted = cipher.encrypt(original)
        val decrypted = cipher.decrypt(encrypted)

        // then
        assertEquals(original, decrypted)
    }

    @Test
    fun `encrypt then decrypt with matching AAD returns original`() {
        // given
        val cipher = AesGcmCipher(validKey)
        val original = "dropbox refresh token"

        // when
        val encrypted = cipher.encrypt(original, aad = "dropbox.refreshToken")
        val decrypted = cipher.decrypt(encrypted, aad = "dropbox.refreshToken")

        // then
        assertEquals(original, decrypted)
    }

    @Test
    fun `decrypt with wrong AAD fails`() {
        // given
        val cipher = AesGcmCipher(validKey)
        val encrypted = cipher.encrypt("secret api key", aad = "youtube.apiKey")

        // when / then
        assertFailsWith<AEADBadTagException> {
            cipher.decrypt(encrypted, aad = "discord.token")
        }
    }

    @Test
    fun `AAD prevents ciphertext swap between fields`() {
        // given
        val cipher = AesGcmCipher(validKey)
        val dropboxSecret = cipher.encrypt("dropbox-app-secret", aad = "dropbox.appSecret")
        val youtubeKey = cipher.encrypt("youtube-api-key", aad = "youtube.apiKey")

        // when / then
        assertFailsWith<AEADBadTagException> {
            cipher.decrypt(dropboxSecret, aad = "youtube.apiKey")
        }
        assertFailsWith<AEADBadTagException> {
            cipher.decrypt(youtubeKey, aad = "dropbox.appSecret")
        }
    }

    @Test
    fun `decrypt with wrong key fails`() {
        // given
        val cipher = AesGcmCipher(validKey)
        val encrypted = cipher.encrypt("secret data")
        val wrongCipher = AesGcmCipher("/v7DGPJrNsW+pWn4VA9wBTvVNQTPHbff0snFxlqN5Fo=")

        // when / then
        assertFailsWith<AEADBadTagException> {
            wrongCipher.decrypt(encrypted)
        }
    }

    @Test
    fun `decrypt with invalid format fails`() {
        // given
        val cipher = AesGcmCipher(validKey)

        // when / then
        assertFailsWith<IllegalArgumentException> {
            cipher.decrypt("too-few-parts")
        }
    }

    @Test
    fun `decrypt with unsupported version fails`() {
        // given
        val cipher = AesGcmCipher(validKey)

        // when / then
        assertFailsWith<IllegalArgumentException> {
            cipher.decrypt("v0:abcd:efgh")
        }
    }

    @Test
    fun `tampered ciphertext structure fails`() {
        // given
        val cipher = AesGcmCipher(validKey)
        val encrypted = cipher.encrypt("important data")

        // when
        val tampered = encrypted.replaceFirst(':', '!')

        // then
        assertFailsWith<IllegalArgumentException> {
            cipher.decrypt(tampered)
        }
    }

    @Test
    fun `tampered ciphertext data fails authentication`() {
        // given
        val cipher = AesGcmCipher(validKey)
        val encrypted = cipher.encrypt("important data")

        // when
        val lastColon = encrypted.lastIndexOf(':')
        val tampered = encrypted.take(lastColon + 1) + 'X' + encrypted.drop(lastColon + 2)

        // then
        assertFailsWith<AEADBadTagException> {
            cipher.decrypt(tampered)
        }
    }

    @Test
    fun `empty string roundtrips`() {
        // given
        val cipher = AesGcmCipher(validKey)

        // when
        val encrypted = cipher.encrypt("")
        val decrypted = cipher.decrypt(encrypted)

        // then
        assertEquals("", decrypted)
    }

    @Test
    fun `unicode roundtrips`() {
        // given
        val cipher = AesGcmCipher(validKey)
        val original = "Hëllö Wörld 🌍 日本語"

        // when
        val encrypted = cipher.encrypt(original)
        val decrypted = cipher.decrypt(encrypted)

        // then
        assertEquals(original, decrypted)
    }

    @Test
    fun `each encryption produces different output`() {
        // given
        val cipher = AesGcmCipher(validKey)
        val plaintext = "same text each time"

        // when
        val encrypted1 = cipher.encrypt(plaintext)
        val encrypted2 = cipher.encrypt(plaintext)

        // then
        assertNotEquals(encrypted1, encrypted2)
    }

    @Test
    fun `key too short rejects`() {
        // when / then
        assertFailsWith<IllegalArgumentException> {
            AesGcmCipher("c29tZXRoaW5n")
        }
    }

    @Test
    fun `key too long rejects`() {
        // when / then
        assertFailsWith<IllegalArgumentException> {
            AesGcmCipher("Vqq6vLMPJ+o3LQVOxD0awg3nVx4YFF9kZ9p2Jx6M9kE=Vqq6vLMPJ+o3")
        }
    }

    @Test
    fun `invalid base64 key rejects`() {
        // when / then
        assertFailsWith<IllegalArgumentException> {
            AesGcmCipher("!!!")
        }
    }
}
