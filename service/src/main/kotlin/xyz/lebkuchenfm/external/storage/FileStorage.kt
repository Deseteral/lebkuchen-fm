package xyz.lebkuchenfm.external.storage

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.auth.Auth
import io.ktor.client.plugins.auth.providers.BearerTokens
import io.ktor.client.plugins.auth.providers.bearer
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.accept
import io.ktor.client.request.forms.FormDataContent
import io.ktor.client.request.headers
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.URLBuilder
import io.ktor.http.contentType
import io.ktor.http.parameters
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.config.ApplicationConfig
import kotlinx.serialization.json.Json
import xyz.lebkuchenfm.external.storage.dropbox.models.ShareFile
import xyz.lebkuchenfm.external.storage.dropbox.models.ShareFileResponse
import xyz.lebkuchenfm.external.storage.dropbox.models.ShareFileSettings
import xyz.lebkuchenfm.external.storage.dropbox.models.TokenInfo
import xyz.lebkuchenfm.external.storage.dropbox.models.UploadFileArgs
import xyz.lebkuchenfm.external.storage.dropbox.models.UploadFileResponse

data class FileUploadResult(
    val publicUrl: String
)

sealed class Storage {
    data object XSound : Storage()
    class Custom(
        val path: String
    ) : Storage()
}

class FileStorage(private val config: ApplicationConfig) {

    private val client = prepareClient()
    private val bearerTokenStorage = mutableListOf<BearerTokens>()
    private val refreshToken = config.property(DROPBOX_REFRESH_TOKEN_PROPERTY_PATH).getString()
    private val appKey = config.property(DROPBOX_APP_KEY_PROPERTY_PATH).getString()
    private val appSecret = config.property(DROPBOX_APP_SECRET_PROPERTY_PATH).getString()

    companion object {
        const val DROPBOX_REFRESH_TOKEN_PROPERTY_PATH = "storage.dropbox.refreshToken"
        const val DROPBOX_APP_KEY_PROPERTY_PATH = "storage.dropbox.appKey"
        const val DROPBOX_APP_SECRET_PROPERTY_PATH = "storage.dropbox.appSecret"
    }

    suspend fun uploadFile(storage: Storage, name: String, bytes: ByteArray): Result<FileUploadResult> {
        if (bearerTokenStorage.isEmpty()) {
            getInitialTokens()
        }

        val path = when (storage) {
            is Storage.XSound -> "/lebkuchenFM/x-sounds/"
            is Storage.Custom -> storage.path
        }

        val args = UploadFileArgs("$path$name", "add", false, false)
        val argsString = Json.encodeToString(UploadFileArgs.serializer(), args)

        val uploadFile: UploadFileResponse = client.post("https://content.dropboxapi.com/2/files/upload") {
            setBody(bytes)
            contentType(ContentType.Application.OctetStream)
            accept(ContentType.Application.Json)
            headers {
                append("Dropbox-API-Arg", argsString)
            }
        }.body()

        val sharedFile: ShareFileResponse = client.post("https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings") {
            setBody(ShareFile(uploadFile.pathDisplay, ShareFileSettings("viewer", "public", true )))
            contentType(ContentType.Application.Json)
        }.body()

        val url = URLBuilder(sharedFile.url).apply {
            this.host = "dl.dropboxusercontent.com"
            this.parameters.remove("dl")
        }.buildString()

        println("obtained url: ${sharedFile.url}")
        println("sharing url: $url")
        return Result.success(FileUploadResult(url))
    }

    private fun getRefreshTokenRequestBody() = FormDataContent(parameters {
        append("refresh_token", refreshToken)
        append("client_id", appKey)
        append("client_secret", appSecret)
        append("grant_type", "refresh_token")
    })

    private suspend fun getInitialTokens() {
        val tokenInfo: TokenInfo = HttpClient(CIO) {
            install(ContentNegotiation) { json() }
        }.post("https://api.dropbox.com/oauth2/token") {
            setBody( getRefreshTokenRequestBody() )
            contentType(ContentType.Application.FormUrlEncoded)
        }.body()

        bearerTokenStorage.add(BearerTokens(tokenInfo.accessToken, refreshToken))
    }

    private fun prepareClient(): HttpClient {
        return HttpClient(CIO) {
            install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
            install(Auth) {
                bearer {
                    loadTokens {
                        bearerTokenStorage.lastOrNull()
                    }
                    sendWithoutRequest { true }
                    refreshTokens {
                        val tokenInfo: TokenInfo = client.post("https://api.dropbox.com/oauth2/token") {
                            markAsRefreshTokenRequest()
                            setBody(getRefreshTokenRequestBody())
                            accept(ContentType.Application.Json)
                            contentType(ContentType.Application.FormUrlEncoded)
                        }.body()
                        bearerTokenStorage.clear()
                        bearerTokenStorage.add(BearerTokens(accessToken = tokenInfo.accessToken, refreshToken = refreshToken))
                        bearerTokenStorage.last()
                    }
                }
            }
        }
    }
}
