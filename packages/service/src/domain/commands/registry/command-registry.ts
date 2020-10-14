import CommandDefinition from '../model/command-definition';
import Logger from '../../../infrastructure/logger';

const logger = new Logger('command-registry');

const commands = new Map<string, CommandDefinition>();

function register(definition: CommandDefinition): void {
  commands.set(definition.key, definition);

  if (definition.shortKey) {
    commands.set(definition.shortKey, definition);
  }

  logger.info(`Initialized ${definition.key} command`);
}

function getRegistry(): Map<string, CommandDefinition> {
  return commands;
}

export {
  register,
  getRegistry,
};
