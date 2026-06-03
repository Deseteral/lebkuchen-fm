package xyz.lebkuchenfm.api.xsounds

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.coroutines.runSuspendCatching
import com.github.michaelbull.result.get
import io.ktor.http.content.PartData
import io.ktor.utils.io.readRemaining
import kotlinx.io.readByteArray

sealed interface XSoundUploadError {
    data class InvalidSoundName(val detail: String) : XSoundUploadError
    data object MissingFile : XSoundUploadError
}

class XSoundUploadData(
    val soundName: String,
    val tags: List<String>,
    val fileBytes: ByteArray,
)

class XSoundUploadParser {
    private var soundName: String = ""
    private var tags: List<String> = emptyList()
    private var fileBytes: ByteArray? = null

    suspend fun handle(part: PartData) {
        try {
            when (part) {
                is PartData.FormItem -> handleFormItem(part)
                is PartData.FileItem -> handleFileItem(part)
                else -> Unit
            }
        } finally {
            part.dispose()
        }
    }

    private fun handleFormItem(part: PartData.FormItem) {
        when (part.name) {
            "soundName" -> soundName = part.value
            "tags" -> tags = part.value.split(',').map(String::trim)
        }
    }

    private suspend fun handleFileItem(part: PartData.FileItem) {
        fileBytes = runSuspendCatching {
            part.provider().readRemaining().readByteArray()
        }.get()
    }

    fun parse(): Result<XSoundUploadData, XSoundUploadError> {
        if (soundName.isBlank()) {
            return Err(XSoundUploadError.InvalidSoundName("Sound name must not be empty."))
        }

        val bytes = fileBytes
        if (bytes == null || bytes.isEmpty()) {
            return Err(XSoundUploadError.MissingFile)
        }

        return Ok(XSoundUploadData(soundName, tags, bytes))
    }
}
