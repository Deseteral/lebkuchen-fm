import CommandDefinition from '../model/command-definition';
import Logger from '../../../infrastructure/logger';

type CommandRegistry = Map<string, CommandDefinition>;

class CommandRegistryService {
  private static logger = new Logger('command-registry');
  private commands: CommandRegistry;

  private constructor() {
    this.commands = new Map();
  }

  register(definition: CommandDefinition): void {
    this.commands.set(definition.key, definition);

    if (definition.shortKey) {
      this.commands.set(definition.shortKey, definition);
    }

    CommandRegistryService.logger.info(`Initialized ${definition.key} command`);
  }

  getRegistry(): Map<string, CommandDefinition> {
    return this.commands;
  }

  static readonly instance = new CommandRegistryService();
}

export default CommandRegistryService;
export {
  CommandRegistry,
};
