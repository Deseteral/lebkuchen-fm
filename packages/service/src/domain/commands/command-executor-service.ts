import { ExecutionContext } from '@service/domain/commands/execution-context';
import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponses } from '@service/domain/commands/model/command-processing-response';
import { CommandRegistryService } from '@service/domain/commands/registry/command-registry-service';
import { TextCommandParser } from '@service/domain/commands/text-command-parser';
import { Logger } from '@service/infrastructure/logger';
import { Service } from 'typedi';

@Service()
class CommandExecutorService {
  private static logger = new Logger('command-executor-service');

  constructor(private commandRegistryService: CommandRegistryService, private textCommandParser: TextCommandParser) { }

  async processCommand(command: Command, context: ExecutionContext): Promise<CommandProcessingResponse> {
    const commandDefinition = this.commandRegistryService.getRegistry().get(command.key);
    if (!commandDefinition) return CommandExecutorService.commandDoesNotExistResponse;

    try {
      return await commandDefinition.execute(command, context);
    } catch (e) {
      const errorMessage = (e as Error).message;
      CommandExecutorService.logger.error(errorMessage);
      return CommandProcessingResponses.visibleToTheIssuerOnly(errorMessage);
    }
  }

  async processFromText(textCommand: string, context: ExecutionContext): Promise<CommandProcessingResponse> {
    const command = this.textCommandParser.parseTextToCommand(textCommand);
    if (!command) return CommandExecutorService.commandDoesNotExistResponse;

    return this.processCommand(command, context);
  }

  private static get commandDoesNotExistResponse(): CommandProcessingResponse {
    return CommandProcessingResponses.visibleToTheIssuerOnly('Komenda nie istnieje');
  }
}

export { CommandExecutorService };
