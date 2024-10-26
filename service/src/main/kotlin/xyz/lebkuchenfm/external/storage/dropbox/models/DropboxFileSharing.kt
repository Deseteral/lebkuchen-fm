package xyz.lebkuchenfm.external.storage.dropbox.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class DropboxFileSharingSettings(
    val access: String,
    val audience: String,
    @SerialName("allow_download") val allowDownload: Boolean,
)

@Serializable
data class DropboxFileSharing(
    val path: String,
    val settings: DropboxFileSharingSettings,
)

@Serializable
data class DropboxFileSharingResponse(
    val url: String,
)
