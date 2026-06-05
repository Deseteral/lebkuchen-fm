package xyz.lebkuchenfm.api.integrations

import com.github.michaelbull.result.onFailure
import com.github.michaelbull.result.onSuccess
import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import kotlinx.serialization.json.Json
import xyz.lebkuchenfm.api.plugins.mergePatchRoute
import xyz.lebkuchenfm.api.plugins.withScopes
import xyz.lebkuchenfm.api.respondWithProblem
import xyz.lebkuchenfm.domain.auth.Scope
import xyz.lebkuchenfm.domain.integrations.Integrations
import xyz.lebkuchenfm.domain.integrations.IntegrationsService
import xyz.lebkuchenfm.external.discord.DiscordClient
import xyz.lebkuchenfm.external.storage.dropbox.DropboxClient
import xyz.lebkuchenfm.external.storage.dropbox.XSoundsDropboxFileRepository
import xyz.lebkuchenfm.external.youtube.YoutubeClient

private val json = Json {
    encodeDefaults = true
    ignoreUnknownKeys = true
}

fun Route.integrationsRouting(
    integrationsService: IntegrationsService,
    dropboxClient: DropboxClient,
    xSoundsDropboxFileRepository: XSoundsDropboxFileRepository,
    youtubeClient: YoutubeClient,
    discordClient: DiscordClient,
) {
    route("/integrations") {
        withScopes(Scope.INTEGRATIONS_MANAGE) {
            get {
                val domain = integrationsService.getIntegrations()
                call.respond(domain.toSecureResponse())
            }

            mergePatchRoute<IntegrationsDto>(
                json = json,
                stateReader = { integrationsService.getIntegrations().toDto() },
                onMerged = { oldDto, newDto ->
                    val oldDomain = oldDto.toDomain()
                    val newDomain = newDto.toDomain()

                    integrationsService.storeIntegrations(newDomain)
                        .onSuccess { updated ->
                            // TODO: Implement rollback procedure for partial reconfigure failures.
                            //       If one client's reconfigure() throws, the remaining clients
                            //       should be rolled back to their previous state to avoid
                            //       inconsistent runtime configuration across services.
                            reconfigureAffectedClients(
                                oldDomain,
                                updated,
                                dropboxClient,
                                xSoundsDropboxFileRepository,
                                youtubeClient,
                                discordClient,
                            )
                            respond(updated.toSecureResponse())
                        }
                        .onFailure {
                            respondWithProblem(
                                title = "Integrations Update Failed",
                                detail = "Could not persist integration configuration.",
                                status = HttpStatusCode.InternalServerError,
                            )
                        }
                },
            )
        }
    }
}

private suspend fun reconfigureAffectedClients(
    old: Integrations,
    updated: Integrations,
    dropboxClient: DropboxClient,
    xSoundsDropboxFileRepository: XSoundsDropboxFileRepository,
    youtubeClient: YoutubeClient,
    discordClient: DiscordClient,
) {
    if (old.dropbox != updated.dropbox) {
        dropboxClient.reconfigure(updated.dropbox)
        xSoundsDropboxFileRepository.setStoragePath(updated.dropbox?.xSoundsPath)
    }
    if (old.youtube != updated.youtube) {
        youtubeClient.reconfigure(updated.youtube)
    }
    if (old.discord != updated.discord) {
        discordClient.reconfigure(updated.discord)
    }
}
