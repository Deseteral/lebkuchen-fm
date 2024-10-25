package xyz.lebkuchenfm.external.storage.dropbox.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ShareFileSettings(
    val access: String,
    val audience: String,
    @SerialName("allow_download") val allowDownload: Boolean
)

@Serializable
data class ShareFile(
    val path: String,
    val settings: ShareFileSettings
)

@Serializable
data class ShareFileResponse(
    val url: String,
)
