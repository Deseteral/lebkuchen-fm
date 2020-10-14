import CommandDefinition from '../model/command-definition';
import Logger from '../../../infrastructure/logger';

class CommandRegistry {
  private static logger = new Logger('command-registry');
  private commands: Map<string, CommandDefinition>;

  private constructor() {
    this.commands = new Map();
  }

  register(definition: CommandDefinition): void {
    this.commands.set(definition.key, definition);

    if (definition.shortKey) {
      this.commands.set(definition.shortKey, definition);
    }

    CommandRegistry.logger.info(`Initialized ${definition.key} command`);
  }

  getRegistry(): Map<string, CommandDefinition> {
    return this.commands;
  }

  static readonly instance = new CommandRegistry();
}

export default CommandRegistry;
