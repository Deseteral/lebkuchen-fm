package xyz.lebkuchenfm.external.storage.dropbox

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.auth.Auth
import io.ktor.client.plugins.auth.AuthCircuitBreaker
import io.ktor.client.plugins.auth.providers.BearerTokens
import io.ktor.client.plugins.auth.providers.bearer
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.HttpRequestBuilder
import io.ktor.client.request.accept
import io.ktor.client.request.forms.FormDataContent
import io.ktor.client.request.headers
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.request.url
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

class DropboxClient(config: ApplicationConfig) {
    private val client by lazy { authorizedClient }
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

        val uploadFile: DropboxFileUploadResponse = client.post(API_FILE_UPLOAD_URL) {
            setBody(bytes)
            contentType(ContentType.Application.OctetStream)
            accept(ContentType.Application.Json)
            headers { append("Dropbox-API-Arg", argsString) }
        }.body()

        val sharedFile: DropboxFileSharingResponse = client.post(API_FILE_SHARING_URL) {
            val sharingSettings = DropboxFileSharingSettings("viewer", "public", allowDownload = true)
            setBody(DropboxFileSharing(uploadFile.pathDisplay, sharingSettings))
            contentType(ContentType.Application.Json)
        }.body()

        val resourceUrl = URLBuilder(sharedFile.url).apply {
            host = DL_DROPBOX_HOST
            parameters.remove("dl")
        }.buildString()

        return resourceUrl
    }

    private suspend fun getInitialTokens() {
        val client = HttpClient(OkHttp) { install(ContentNegotiation) { json() } }
        val tokenInfo: DropboxTokenInfo = client.post(tokenPostRequest).body()
        bearerTokenStorage.add(BearerTokens(tokenInfo.accessToken, refreshToken))
    }

    private val authorizedClient: HttpClient = HttpClient(OkHttp) {
        install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
        install(Auth) {
            bearer {
                loadTokens {
                    bearerTokenStorage.lastOrNull()
                }
                sendWithoutRequest { true }
                refreshTokens {
                    val tokenInfo: DropboxTokenInfo = client.post(tokenPostRequest).body()
                    bearerTokenStorage.clear()
                    bearerTokenStorage.add(
                        BearerTokens(accessToken = tokenInfo.accessToken, refreshToken = refreshToken),
                    )
                    bearerTokenStorage.last()
                }
            }
        }
    }

    private val tokenPostRequest: HttpRequestBuilder.() -> Unit = {
        attributes.put(AuthCircuitBreaker, Unit)
        url(API_OAUTH_TOKEN_URL)
        accept(ContentType.Application.Json)
        contentType(ContentType.Application.FormUrlEncoded)
        setBody(
            FormDataContent(
                parameters {
                    append("refresh_token", refreshToken)
                    append("client_id", appKey)
                    append("client_secret", appSecret)
                    append("grant_type", "refresh_token")
                },
            ),
        )
    }

    private companion object {
        const val DL_DROPBOX_HOST = "dl.dropboxusercontent.com"
        const val API_FILE_UPLOAD_URL = "https://content.dropboxapi.com/2/files/upload"
        const val API_OAUTH_TOKEN_URL = "https://api.dropbox.com/oauth2/token"
        const val API_FILE_SHARING_URL = "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings"
        const val DROPBOX_REFRESH_TOKEN_PROPERTY_PATH = "storage.dropbox.auth.refreshToken"
        const val DROPBOX_APP_KEY_PROPERTY_PATH = "storage.dropbox.auth.appKey"
        const val DROPBOX_APP_SECRET_PROPERTY_PATH = "storage.dropbox.auth.appSecret"
    }
}