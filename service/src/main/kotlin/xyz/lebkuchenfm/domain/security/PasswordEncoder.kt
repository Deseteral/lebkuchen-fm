package xyz.lebkuchenfm.domain.security

interface PasswordEncoder {
    fun encode(password: String, salt: String): HashedPasswordHexEncoded
}

@JvmInline
value class HashedPasswordHexEncoded(val value: String) {
    @OptIn(ExperimentalStdlibApi::class)
    constructor(byteArray: ByteArray) : this(byteArray.toHexString())
}
