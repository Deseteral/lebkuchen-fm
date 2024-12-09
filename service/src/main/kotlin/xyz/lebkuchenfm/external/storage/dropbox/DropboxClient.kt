package xyz.lebkuchenfm.external.storage.dropbox
import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import dev.kord.rest.request.errorString
import io.github.oshai.kotlinlogging.KotlinLogging
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
import io.ktor.http.isSuccess
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

private val logger = KotlinLogging.logger {}

class DropboxClient(config: ApplicationConfig) {
    private val client by lazy { authorizedClient }
    private val bearerTokenStorage = mutableListOf<BearerTokens>()
    private val refreshToken by lazy { config.propertyOrNull(DROPBOX_REFRESH_TOKEN_PROPERTY_PATH)?.getString() }
    private val appKey by lazy { config.propertyOrNull(DROPBOX_APP_KEY_PROPERTY_PATH)?.getString() }
    private val appSecret by lazy { config.propertyOrNull(DROPBOX_APP_SECRET_PROPERTY_PATH)?.getString() }

    /**
     * [path] must contain destination folder, file name and its extension
     * [bytes] contains file content data
     * @return file download link url
     */
    suspend fun uploadFile(path: String, bytes: ByteArray): Result<String, DropboxClientError> {
        if (refreshToken == null || appKey == null || appSecret == null) {
            logger.warn { "Tried to use Dropbox client but its config is missing." }
            return Err(DropboxClientError.ClientConfigMissing)
        }

        if (bearerTokenStorage.isEmpty()) {
            try {
                getInitialTokens()
            } catch (e: Exception) {
                logger.error(e) { "Could not exchange Dropbox auth tokens." }
                return Err(DropboxClientError.AuthorizationError)
            }
        }

        val args = DropboxFileUploadArgs(path, mode = "add", autorename = false, mute = false, strictConflict = true)
        val argsString = Json.encodeToString(DropboxFileUploadArgs.serializer(), args)

        val fileUploadResponse = client.post(API_FILE_UPLOAD_URL) {
            setBody(bytes)
            contentType(ContentType.Application.OctetStream)
            accept(ContentType.Application.Json)
            headers { append("Dropbox-API-Arg", argsString) }
        }

        if (!fileUploadResponse.status.isSuccess()) {
            val error = fileUploadResponse.errorString()
            logger.error { error }
            return Err(DropboxClientError.ErrorWhenUploadingFile)
        }

        val uploadFile: DropboxFileUploadResponse = fileUploadResponse.body()

        val fileSharingResponse = client.post(API_FILE_SHARING_URL) {
            val sharingSettings = DropboxFileSharingSettings("viewer", "public", allowDownload = true)
            setBody(DropboxFileSharing(uploadFile.pathDisplay, sharingSettings))
            contentType(ContentType.Application.Json)
        }

        if (!fileSharingResponse.status.isSuccess()) {
            val error = fileSharingResponse.errorString()
            logger.error { error }
            return Err(DropboxClientError.ErrorWhenCreatingFileUrl)
        }

        val sharedFile: DropboxFileSharingResponse = fileSharingResponse.body()

        val resourceUrl = URLBuilder(sharedFile.url).apply {
            host = DL_DROPBOX_HOST
            parameters.remove("dl")
        }.buildString()

        return Ok(resourceUrl)
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
                    refreshToken?.let { append("refresh_token", it) }
                    appKey?.let { append("client_id", it) }
                    appSecret?.let { append("client_secret", it) }
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

    sealed class DropboxClientError {
        data object ClientConfigMissing : DropboxClientError()
        data object AuthorizationError : DropboxClientError()
        data object ErrorWhenUploadingFile : DropboxClientError()
        data object ErrorWhenCreatingFileUrl : DropboxClientError()
    }
}
