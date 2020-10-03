import CommandDefinition from './command-definition';

interface CommandRegistry {
  [key: string]: CommandDefinition;
}

const commands: CommandRegistry = {};

function register(definition: CommandDefinition): void {
  commands[definition.key] = definition;
  if (definition.shortKey) {
    commands[definition.shortKey] = definition;
  }
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
