import { Service } from 'typedi';
import { Client, Intents, Interaction, InteractionReplyOptions } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Configuration } from '@service/infrastructure/configuration';
import { CommandExecutorService } from '@service/domain/commands/command-executor-service';
import { CommandProcessingResponse } from '@service/domain/commands/model/command-processing-response';
import { Logger } from '@service/infrastructure/logger';
import { UsersService } from '@service/domain/users/users-service';

@Service()
class DiscordClient {
  private static logger: Logger = new Logger('discord-client');

  private client: Client;
  private rest: REST;

  constructor(private configuration: Configuration, private commandExecutorService: CommandExecutorService, private usersService: UsersService) {
    this.client = new Client({ intents: [Intents.FLAGS.GUILDS] });
    this.rest = new REST({ version: '9' }).setToken(this.configuration.DISCORD_TOKEN);

    this.client.once('ready', () => this.ready());
    this.client.on('interactionCreate', async (interaction) => this.interactionCreate(interaction));
  }

  public async login(): Promise<void> {
    await this.client.login(this.configuration.DISCORD_TOKEN);
  }

  public async registerCommands(): Promise<void> {
    try {
      DiscordClient.logger.info('Registering slash commands');

      const command = new SlashCommandBuilder()
        .setName(this.configuration.COMMAND_PROMPT.slice(1))
        .setDescription('LebkuchenFM')
        .addStringOption((option) => option.setName('command').setDescription('Command').setRequired(true))
        .toJSON();

      const route = Routes.applicationGuildCommands(
        this.configuration.DISCORD_CLIENT_ID,
        this.configuration.DISCORD_GUILD_ID,
      );

      await this.rest.put(route, { body: [command] });

      DiscordClient.logger.info('Successfully refreshed slash commands');
    } catch (error) {
      DiscordClient.logger.error('There was a problem with refreshing slash commands');
      DiscordClient.logger.withError(error as Error);
    }
  }

  private ready(): void {
    DiscordClient.logger.info('Discord bot is ready');
  }

  private async interactionCreate(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) return;

    if (interaction.channelId !== this.configuration.DISCORD_CHANNEL_ID) {
      await interaction.reply({ content: "You're not allowed to use this command here", ephemeral: true });
      return;
    }

    const discordId = interaction.user.id;

    if (!this.usersService.hasConnectedDiscordAccount(discordId)) {
      await interaction.reply({
        content: `You have to connect your Discord account with LebkuchenFM\nUse \`${this.configuration.COMMAND_PROMPT} login <lebkuchen-fm-username>\` to login.`,
        ephemeral: true,
      });
      return;
    }

    const messageContent = `${this.configuration.COMMAND_PROMPT} ${interaction.options.getString('command', true)}`;
    const commandProcessingResponse = await this.commandExecutorService.processFromText(messageContent);
    const response = this.mapCommandProcessingResponseToDiscordResponse(commandProcessingResponse);

    try {
      await interaction.reply(response);
    } catch (error) {
      DiscordClient.logger.error('There was a problem sending command response');
      DiscordClient.logger.withError(error as Error);
    }
  }

  private mapCommandProcessingResponseToDiscordResponse(commandProcessingResponse: CommandProcessingResponse): InteractionReplyOptions {
    const content = commandProcessingResponse.messages.map((message: any) => message.text || '').join('\n'); // TODO: Convert with formatting
    return {
      content,
      ephemeral: commandProcessingResponse.isVisibleToIssuerOnly,
    };
  }
}

export { DiscordClient };
