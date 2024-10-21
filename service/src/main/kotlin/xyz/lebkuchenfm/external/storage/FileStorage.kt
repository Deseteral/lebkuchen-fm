package xyz.lebkuchenfm.external.storage

import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.request.bearerAuth
import io.ktor.client.request.headers
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive

@Serializable
@Suppress( "PropertyName")
data class DropboxUploadResponse(
    val id: String,
    val name: String,
    val path_display: String,
    val path_lower: String,
)

@Serializable
data class DropboxShareResponse(
    val url: String,
)

data class FileUploadResult(
    val publicUrl: String
)

sealed class Storage {
    data object XSound : Storage()
    class Custom(
        val path: String
    ) : Storage()
}

class FileStorage {
    suspend fun uploadFile(storage: Storage, name: String, bytes: ByteArray): Result<FileUploadResult> {
        val client = HttpClient(CIO) {}
        val dropBoxToken = "dropbox token received from below curl"
        // TODO: handle token refreshing when response status code is 401
        //
        //  curl https://api.dropbox.com/oauth2/token \
        //    -d refresh_token=REFRESHTOKENHERE \
        //    -d grant_type=refresh_token \
        //    -d client_id=APPKEYHERE \
        //    -d client_secret=APPSECRETHERE


        val path = when (storage) {
            is Storage.XSound -> "/lebkuchenFM/x-sounds/"
            is Storage.Custom -> storage.path
        }

        val dropboxApiArgs = mapOf(
            "autorename" to JsonPrimitive(false),
            "mode" to JsonPrimitive("add"),
            "mute" to JsonPrimitive(false),
            "path" to JsonPrimitive("$path$name"),
        )

        val uploadResponse: HttpResponse = client.post("https://content.dropboxapi.com/2/files/upload") {
            setBody(bytes)
            contentType(ContentType.Application.OctetStream)
            bearerAuth(dropBoxToken)
            headers {
                append("Dropbox-API-Arg", JsonObject(dropboxApiArgs).toString())
            }
        }
        println(uploadResponse.bodyAsText())
        if (uploadResponse.status != HttpStatusCode.OK) { throw Exception(uploadResponse.bodyAsText()) }
        val jsonParser = Json { ignoreUnknownKeys = true }
        // TODO: try again to find better way of decoding
        val uploadedFile: DropboxUploadResponse = jsonParser.decodeFromString(uploadResponse.bodyAsText())

        val sharingParameters = JsonObject(mapOf(
            "path" to JsonPrimitive(uploadedFile.path_display),
            "settings" to JsonObject(mapOf(
                "access" to JsonPrimitive("viewer"),
                "allow_download" to JsonPrimitive(true),
                "audience" to JsonPrimitive("public"),
                "requested_visibility" to JsonPrimitive("public")
            ))
        ))

        val sharingResponse: HttpResponse = client.post("https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings") {
            setBody(sharingParameters.toString())
            contentType(ContentType.Application.Json)
            bearerAuth(dropBoxToken)
        }

        println(sharingResponse.bodyAsText())
        if (sharingResponse.status != HttpStatusCode.OK) { throw Exception(sharingResponse.bodyAsText()) }
        val sharedFile: DropboxShareResponse = jsonParser.decodeFromString(sharingResponse.bodyAsText())

        println("upload status: ${uploadResponse.status}")
        println("sharing url: ${sharedFile.url}")

        // TODO: Change format of url to dl.dropbox.com
        return Result.success(FileUploadResult(sharedFile.url))
    }
}
