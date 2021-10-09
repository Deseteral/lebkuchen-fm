import { Service } from 'typedi';
import Command from './model/command';
import TextCommandParser from './text-command-parser';
import { CommandProcessingResponse, makeSingleTextProcessingResponse } from './model/command-processing-response';
import Logger from '../../infrastructure/logger';
import CommandRegistryService from './registry/command-registry-service';

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
      return makeSingleTextProcessingResponse((e as Error).message, false);
    }
  }

  async processFromText(textCommand: string): Promise<CommandProcessingResponse> {
    const command = this.textCommandParser.parseTextToCommand(textCommand);
    if (!command) return CommandExecutorService.commandDoesNotExistResponse;

    return this.processCommand(command);
  }

  private static get commandDoesNotExistResponse(): CommandProcessingResponse {
    return makeSingleTextProcessingResponse('Komenda nie istnieje', true);
  }
}

export default CommandExecutorService;
