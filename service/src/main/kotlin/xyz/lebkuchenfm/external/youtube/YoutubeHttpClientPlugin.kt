package xyz.lebkuchenfm.external.youtube

import io.ktor.client.plugins.api.createClientPlugin
import io.ktor.client.request.host
import io.ktor.client.request.parameter
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders.Accept
import io.ktor.http.URLProtocol
import io.ktor.server.plugins.MissingRequestParameterException

val YoutubeHttpClientPlugin =
    createClientPlugin("YoutubeApiKeyPlugin", ::YoutubeHttpPluginConfig) {
        val apiKey = pluginConfig.apiKey
        val host = pluginConfig.host
        val basePath = pluginConfig.basePath

        onRequest { request, _ ->
            if (apiKey == null) {
                throw MissingRequestParameterException("key")
            }
            request.parameter(key = "key", value = apiKey)

            val requestedPathSegments = request.url.pathSegments.filterBlank()
            val newSegments: List<String> = basePath.safePath() + requestedPathSegments
            request.host = host
            request.url.protocol = URLProtocol.HTTPS
            request.url.pathSegments = newSegments
            request.headers.append(Accept, ContentType.Application.Json.toString())
        }
    }

fun List<String>.filterBlank() = filter { it.isNotBlank() }

fun String.safePath() = split("/").filterBlank()

class YoutubeHttpPluginConfig {
    var apiKey: String? = null
    var host: String = "www.googleapis.com"
    var basePath: String = "/youtube/v3"
}
