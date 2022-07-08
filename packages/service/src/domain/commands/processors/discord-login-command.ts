import { ExecutionContext } from '@service/domain/commands/execution-context';
import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, makeSingleTextProcessingResponse } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { User } from '@service/domain/users/user';
import { UsersService } from '@service/domain/users/users-service';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class DiscordLoginCommand extends CommandProcessor {
  constructor(private usersService: UsersService) {
    super();
  }

  async execute(command: Command, context: ExecutionContext): Promise<CommandProcessingResponse> {
    const username = command.rawArgs;
    const user: (User | null) = await this.usersService.getByName(username);
    const { discordId } = context;

    if (!user) throw new Error(`There is no user \`"${username}\``);
    if (!discordId) throw new Error('This command must be used from Discord');

    await this.usersService.connectWithDiscordAccount(user, discordId);

    return makeSingleTextProcessingResponse('Successfully conntected Discord account', true);
  }

  get key(): string {
    return 'discord-login';
  }

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Powiązuje konto Discord z kontem LebkuchenFM';
  }

  get helpUsages(): (string[] | null) {
    return [
      '<lebkuchen-fm-username>',
    ];
  }
}

export { DiscordLoginCommand };
