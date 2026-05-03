package xyz.lebkuchenfm.external.discord

import dev.kord.common.entity.PresenceStatus
import dev.kord.core.Kord
import dev.kord.core.behavior.reply
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.gateway.Intent
import dev.kord.gateway.Intents
import dev.kord.gateway.PrivilegedIntent
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.flow.filterIsInstance
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.launch
import xyz.lebkuchenfm.domain.commands.CommandExecutorService
import xyz.lebkuchenfm.domain.commands.ExecutionContext
import xyz.lebkuchenfm.domain.integrations.DiscordIntegration
import xyz.lebkuchenfm.domain.users.UsersService

private val logger = KotlinLogging.logger {}

class DiscordClient(
    integration: DiscordIntegration?,
    private val commandExecutorService: CommandExecutorService,
    private val userService: UsersService,
) {
    private var token: String? = integration?.token
    private var commandPrompt: String? = integration?.effectiveCommandPrompt
    private var channelId: String? = integration?.channelId

    private var scope: CoroutineScope? = null
    private var kord: Kord? = null
    private var activeJob: Job? = null

    fun start(scope: CoroutineScope) {
        this.scope = scope
        activeJob = scope.launch { connect() }
    }

    suspend fun reconfigure(integration: DiscordIntegration?) {
        activeJob?.cancel()
        activeJob = null
        kord?.shutdown()
        kord = null

        token = integration?.token
        commandPrompt = integration?.effectiveCommandPrompt
        channelId = integration?.channelId

        scope?.let { start(it) }
    }

    private suspend fun connect() {
        val currentToken = token
        if (currentToken == null) {
            logger.warn { "Discord Bot token not provided." }
            return
        }

        val currentCommandPrompt = commandPrompt
        if (currentCommandPrompt == null) {
            logger.warn { "CommandPrompt prompt not provided." }
            return
        }

        val currentChannelId = channelId
        if (currentChannelId == null) {
            logger.warn { "Channel id not provided." }
            return
        }

        val newKord = Kord(currentToken)
        kord = newKord

        newKord.events
            .filterIsInstance<MessageCreateEvent>()
            .map { it.message }
            .filter { it.channelId.value.toString() == currentChannelId }
            .filter { it.content.split(' ').firstOrNull() == currentCommandPrompt }
            .filter { it.author != null }
            .filter { it.author?.isBot == false }
            .onEach {
                val author = requireNotNull(it.author)
                val user = userService.getByDiscordId(author.id.toString())

                when {
                    user == null -> {
                        it.reply { content = "You have to link your Discord account with LebkuchenFM user." }
                    }

                    user.secret == null -> {
                        it.reply { content = "You must login to LebkuchenFM, before you can use Discord integration." }
                    }

                    else -> {
                        val context = ExecutionContext(
                            username = user.data.name,
                            grantedScopes = user.effectiveScopes,
                            commandPrompt = currentCommandPrompt,
                        )
                        val commandText = it.content.replace("$currentCommandPrompt ", "")
                        val result = commandExecutorService.executeFromText(commandText, context)
                        it.reply { content = result.markdown }
                    }
                }
            }
            .launchIn(newKord)

        newKord.login {
            @OptIn(PrivilegedIntent::class)
            intents = Intents(
                Intent.Guilds,
                Intent.MessageContent,
                Intent.GuildMessages,
            )
            presence {
                status = PresenceStatus.Online
            }
        }
    }
}
