import Command from './model/command';
import { parseTextToCommand } from './text-command-parser';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from './model/command-processing-response';
import Logger from '../../infrastructure/logger';
import CommandRegistryService, { CommandRegistry } from './registry/command-registry-service';

const logger = new Logger('command-executor-service');

class CommandExecutorService {
  private registry: CommandRegistry;

  private constructor() {
    this.registry = CommandRegistryService.instance.getRegistry();
  }

  async processCommand(command: Command): Promise<CommandProcessingResponse> {
    const commandDefinition = this.registry.get(command.key);
    if (!commandDefinition) return CommandExecutorService.commandDoesNotExistResponse;

    try {
      return await commandDefinition.processor(command);
    } catch (e) {
      logger.error(e);
      return makeSingleTextProcessingResponse((e as Error).message, false);
    }
  }

  async processFromText(textCommand: string): Promise<CommandProcessingResponse> {
    const command = parseTextToCommand(textCommand);
    if (!command) return CommandExecutorService.commandDoesNotExistResponse;

    return this.processCommand(command);
  }

  private static get commandDoesNotExistResponse(): CommandProcessingResponse {
    return makeSingleTextProcessingResponse('Komenda nie istnieje', true);
  }

  static readonly instance = new CommandExecutorService();
}

export default CommandExecutorService;
