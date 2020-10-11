import CommandDefinition from '../model/command-definition';
import * as Logger from '../../../infrastructure/logger';

const commands = new Map<string, CommandDefinition>();

function register(definition: CommandDefinition): void {
  commands.set(definition.key, definition);

  if (definition.shortKey) {
    commands.set(definition.shortKey, definition);
  }

  Logger.info(`Initialized ${definition.key} command`, 'command-registry');
}

function getRegistry(): Map<string, CommandDefinition> {
  return commands;
}

export {
  register,
  getRegistry,
};
