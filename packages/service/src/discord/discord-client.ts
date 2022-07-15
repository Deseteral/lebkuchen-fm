import { Service } from 'typedi';
import { Client, Intents, Message } from 'discord.js';
import { Configuration } from '@service/infrastructure/configuration';
import { CommandExecutorService } from '@service/domain/commands/command-executor-service';
import { Logger } from '@service/infrastructure/logger';
import { UsersService } from '@service/domain/users/users-service';
import { ExecutionContext } from '@service/domain/commands/execution-context';

const DISCORD_LOGIN_COMMAND_KEY = 'discord-login';

@Service()
class DiscordClient {
  private static logger: Logger = new Logger('discord-client');

  private client: Client;

  constructor(private configuration: Configuration, private commandExecutorService: CommandExecutorService, private usersService: UsersService) {
    this.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
    this.client.on('messageCreate', (message) => this.messageCreate(message));
  }

  public async login(): Promise<void> {
    await this.client.login(this.configuration.DISCORD_TOKEN);
    DiscordClient.logger.info('Logged in to Discord');
  }

  private async messageCreate(message: Message): Promise<void> {
    if (!message.content.startsWith(this.configuration.COMMAND_PROMPT)) return;
    if (message.channelId !== this.configuration.DISCORD_CHANNEL_ID) return;

    const discordId: string = message.author.id;
    const hasConnectedAccount: boolean = await this.usersService.hasConnectedDiscordAccount(discordId);
    const isLoginCommand: boolean = message.content.startsWith(`${this.configuration.COMMAND_PROMPT} ${DISCORD_LOGIN_COMMAND_KEY}`);

    if (!hasConnectedAccount && !isLoginCommand) {
      await message.reply(
        `You have to connect your Discord account with LebkuchenFM\nUse \`${this.configuration.COMMAND_PROMPT} ${DISCORD_LOGIN_COMMAND_KEY} <lebkuchen-fm-username>\` to login.`,
      );
      return;
    }

    const context: ExecutionContext = {
      discordId,
    };

    const commandProcessingResponse = await this.commandExecutorService.processFromText(message.content, context);

    try {
      await message.reply(commandProcessingResponse.message.markdown);
    } catch (error) {
      DiscordClient.logger.error('There was a problem sending command response');
      DiscordClient.logger.withError(error as Error);
    }
  }
}

export { DiscordClient };
