import CommandDefinition from '../model/command-definition';
import * as Logger from '../../../infrastructure/logger';

// TODO: Use Map instead
interface CommandRegistry {
  [key: string]: CommandDefinition,
}

const commands: CommandRegistry = {};

function register(definition: CommandDefinition): void {
  commands[definition.key] = definition;
  if (definition.shortKey) {
    commands[definition.shortKey] = definition;
  }

  Logger.info(`Initialized ${definition.key} command`, 'command-registry');
}

function findCommandByKey(commandKey: string): CommandDefinition {
  return commands[commandKey];
}

function getRegistry(): CommandRegistry {
  return commands;
}

export {
  register,
  findCommandByKey,
  getRegistry,
};
