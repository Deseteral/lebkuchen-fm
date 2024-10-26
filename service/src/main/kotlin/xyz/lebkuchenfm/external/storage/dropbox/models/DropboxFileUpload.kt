package xyz.lebkuchenfm.external.storage.dropbox.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class DropboxFileUploadArgs(
    val path: String,
    val mode: String,
    val autorename: Boolean,
    val mute: Boolean,
)

@Serializable
data class DropboxFileUploadResponse(
    val id: String,
    val name: String,
    @SerialName("path_display") val pathDisplay: String,
    @SerialName("path_lower") val pathLower: String,
)
