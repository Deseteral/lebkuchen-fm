package xyz.lebkuchenfm.external.discord

import dev.kord.common.entity.PresenceStatus
import dev.kord.core.Kord
import dev.kord.core.behavior.reply
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.gateway.Intent
import dev.kord.gateway.Intents
import dev.kord.gateway.PrivilegedIntent
import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.server.config.ApplicationConfig
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.flow.filterIsInstance
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.onEach
import xyz.lebkuchenfm.domain.auth.UserSession
import xyz.lebkuchenfm.domain.commands.CommandExecutorService
import xyz.lebkuchenfm.domain.commands.ExecutionContext
import xyz.lebkuchenfm.domain.users.UsersService

private val logger = KotlinLogging.logger {}

class DiscordClient(
    config: ApplicationConfig,
    private val commandExecutorService: CommandExecutorService,
    private val userService: UsersService,
) {
    private lateinit var kord: Kord

    private val token: String? = config.propertyOrNull("discord.token")?.getString()
    private val commandPrompt: String? = config.propertyOrNull("commandPrompt")?.getString()
    private val channelId: String? = config.propertyOrNull("discord.channelId")?.getString()

    suspend fun start() {
        if (token == null) {
            logger.warn { "Discord Bot token not provided." }
            return
        }

        if (commandPrompt == null) {
            logger.warn { "CommandPrompt prompt not provided." }
            return
        }

        if (channelId == null) {
            logger.warn { "Channel id not provided." }
            return
        }

        if (this::kord.isInitialized) {
            return
        }

        kord = Kord(token)

        kord.events
            .filterIsInstance<MessageCreateEvent>()
            .map { it.message }
            .filter { it.channelId.value.toString() == channelId }
            .filter { it.content.split(' ').firstOrNull() == commandPrompt }
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
                        val context = ExecutionContext(UserSession(user.data.name))
                        val commandText = it.content.replace("$commandPrompt ", "")
                        val result = commandExecutorService.executeFromText(commandText, context)
                        it.reply { content = result.message.markdown }
                    }
                }
            }
            .launchIn(kord)

        kord.login {
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
