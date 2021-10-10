import Command from '@service/domain/commands/model/command';
import { CommandProcessingResponse, makeSingleTextProcessingResponse } from '@service/domain/commands/model/command-processing-response';
import CommandRegistryService from '@service/domain/commands/registry/command-registry-service';
import TextCommandParser from '@service/domain/commands/text-command-parser';
import Logger from '@service/infrastructure/logger';
import { Service } from 'typedi';

@Service()
class CommandExecutorService {
  private static logger = new Logger('command-executor-service');

  constructor(private commandRegistryService: CommandRegistryService, private textCommandParser: TextCommandParser) { }

  async processCommand(command: Command): Promise<CommandProcessingResponse> {
    const commandDefinition = this.commandRegistryService.getRegistry().get(command.key);
    if (!commandDefinition) return CommandExecutorService.commandDoesNotExistResponse;

    try {
      return await commandDefinition.execute(command);
    } catch (e) {
      CommandExecutorService.logger.error((e as Error).message);
      return makeSingleTextProcessingResponse((e as Error).message);
    }
  }

  async processFromText(textCommand: string): Promise<CommandProcessingResponse> {
    const command = this.textCommandParser.parseTextToCommand(textCommand);
    if (!command) return CommandExecutorService.commandDoesNotExistResponse;

    return this.processCommand(command);
  }

  private static get commandDoesNotExistResponse(): CommandProcessingResponse {
    return makeSingleTextProcessingResponse('Komenda nie istnieje');
  }
}

export default CommandExecutorService;
