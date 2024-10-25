package xyz.lebkuchenfm.external.storage.dropbox.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ShareFileSettings(
    @SerialName("access") val access: String,
    @SerialName("audience") val audience: String,
    @SerialName("allow_download") val allowDownload: Boolean
)

@Serializable
data class ShareFile(
    @SerialName("path") val path: String,
    @SerialName("settings") val settings: ShareFileSettings
)

@Serializable
data class ShareFileResponse(
    val url: String,
)
