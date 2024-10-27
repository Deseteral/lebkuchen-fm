package xyz.lebkuchenfm.external.storage.dropbox

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.OkHttp
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
import xyz.lebkuchenfm.external.storage.dropbox.models.DropboxFileSharing
import xyz.lebkuchenfm.external.storage.dropbox.models.DropboxFileSharingResponse
import xyz.lebkuchenfm.external.storage.dropbox.models.DropboxFileSharingSettings
import xyz.lebkuchenfm.external.storage.dropbox.models.DropboxFileUploadArgs
import xyz.lebkuchenfm.external.storage.dropbox.models.DropboxFileUploadResponse
import xyz.lebkuchenfm.external.storage.dropbox.models.DropboxTokenInfo

class DropboxFileStorage(config: ApplicationConfig) {
    private val client = prepareClient()
    private val bearerTokenStorage = mutableListOf<BearerTokens>()
    private val refreshToken = config.property(DROPBOX_REFRESH_TOKEN_PROPERTY_PATH).getString()
    private val appKey = config.property(DROPBOX_APP_KEY_PROPERTY_PATH).getString()
    private val appSecret = config.property(DROPBOX_APP_SECRET_PROPERTY_PATH).getString()

    /**
     * [path] must contain destination folder, file name and its extension
     * [bytes] contains file content data
     * @return url on which raw file may be obtained
     */
    suspend fun uploadFile(path: String, bytes: ByteArray): String {
        if (bearerTokenStorage.isEmpty()) {
            getInitialTokens()
        }

        val args = DropboxFileUploadArgs(path, mode = "add", autorename = false, mute = false)
        val argsString = Json.encodeToString(DropboxFileUploadArgs.serializer(), args)

        val uploadFile: DropboxFileUploadResponse = client.post("https://content.dropboxapi.com/2/files/upload") {
            setBody(bytes)
            contentType(ContentType.Application.OctetStream)
            accept(ContentType.Application.Json)
            headers {
                append("Dropbox-API-Arg", argsString)
            }
        }.body()

        val sharedFile: DropboxFileSharingResponse = client.post(
            "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
        ) {
            val sharingSettings = DropboxFileSharingSettings("viewer", "public", allowDownload = true)
            setBody(DropboxFileSharing(uploadFile.pathDisplay, sharingSettings))
            contentType(ContentType.Application.Json)
        }.body()

        val resourceUrl = URLBuilder(sharedFile.url).apply {
            host = "dl.dropboxusercontent.com"
            parameters.remove("dl")
        }.buildString()

        return resourceUrl
    }

    private fun getRefreshTokenRequestBody() = FormDataContent(
        parameters {
            append("refresh_token", refreshToken)
            append("client_id", appKey)
            append("client_secret", appSecret)
            append("grant_type", "refresh_token")
        },
    )

    private suspend fun getInitialTokens() {
        val tokenInfo: DropboxTokenInfo = HttpClient(OkHttp) {
            install(ContentNegotiation) { json() }
        }.post("https://api.dropbox.com/oauth2/token") {
            setBody(getRefreshTokenRequestBody())
            contentType(ContentType.Application.FormUrlEncoded)
        }.body()

        bearerTokenStorage.add(BearerTokens(tokenInfo.accessToken, refreshToken))
    }

    private fun prepareClient(): HttpClient {
        return HttpClient(OkHttp) {
            install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
            install(Auth) {
                bearer {
                    loadTokens {
                        bearerTokenStorage.lastOrNull()
                    }
                    sendWithoutRequest { true }
                    refreshTokens {
                        val tokenInfo: DropboxTokenInfo = client.post("https://api.dropbox.com/oauth2/token") {
                            markAsRefreshTokenRequest()
                            setBody(getRefreshTokenRequestBody())
                            accept(ContentType.Application.Json)
                            contentType(ContentType.Application.FormUrlEncoded)
                        }.body()
                        bearerTokenStorage.clear()
                        bearerTokenStorage.add(
                            BearerTokens(accessToken = tokenInfo.accessToken, refreshToken = refreshToken),
                        )
                        bearerTokenStorage.last()
                    }
                }
            }
        }
    }

    private companion object {
        const val DROPBOX_REFRESH_TOKEN_PROPERTY_PATH = "storage.dropbox.auth.refreshToken"
        const val DROPBOX_APP_KEY_PROPERTY_PATH = "storage.dropbox.auth.appKey"
        const val DROPBOX_APP_SECRET_PROPERTY_PATH = "storage.dropbox.auth.appSecret"
    }
}
