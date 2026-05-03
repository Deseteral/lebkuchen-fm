package xyz.lebkuchenfm.api.integrations

import com.github.michaelbull.result.onFailure
import com.github.michaelbull.result.onSuccess
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.patch
import io.ktor.server.routing.route
import xyz.lebkuchenfm.api.plugins.withScopes
import xyz.lebkuchenfm.api.respondWithProblem
import xyz.lebkuchenfm.domain.auth.Scope
import xyz.lebkuchenfm.domain.integrations.Integrations
import xyz.lebkuchenfm.domain.integrations.IntegrationsPatch
import xyz.lebkuchenfm.domain.integrations.IntegrationsService
import xyz.lebkuchenfm.external.discord.DiscordClient
import xyz.lebkuchenfm.external.storage.dropbox.DropboxClient
import xyz.lebkuchenfm.external.storage.dropbox.XSoundsDropboxFileRepository
import xyz.lebkuchenfm.external.youtube.YoutubeClient

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
                val integrations = integrationsService.getIntegrations()
                call.respond(integrations.toResponse())
            }

            patch {
                val request = call.receive<IntegrationsPatchRequest>()
                val patch = request.toDomain()

                integrationsService.patchIntegrations(patch)
                    .onSuccess { updated ->
                        reconfigureAffectedClients(
                            patch,
                            updated,
                            dropboxClient,
                            xSoundsDropboxFileRepository,
                            youtubeClient,
                            discordClient,
                        )
                        call.respond(updated.toResponse())
                    }
                    .onFailure {
                        call.respondWithProblem(
                            title = "Integrations Update Failed",
                            detail = "Could not persist integration configuration.",
                            status = HttpStatusCode.InternalServerError,
                        )
                    }
            }
        }
    }
}

private suspend fun reconfigureAffectedClients(
    patch: IntegrationsPatch,
    updated: Integrations,
    dropboxClient: DropboxClient,
    xSoundsDropboxFileRepository: XSoundsDropboxFileRepository,
    youtubeClient: YoutubeClient,
    discordClient: DiscordClient,
) {
    if (patch.dropbox != null) {
        dropboxClient.reconfigure(updated.dropbox)
        xSoundsDropboxFileRepository.setStoragePath(updated.dropbox?.xSoundsPath)
    }
    if (patch.youtube != null) {
        youtubeClient.reconfigure(updated.youtube)
    }
    if (patch.discord != null) {
        discordClient.reconfigure(updated.discord)
    }
}
