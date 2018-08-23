import CommandDefinition from '../../domain/CommandDefinition';

interface CommandsRegistry {
  [key: string]: CommandDefinition;
}

const commands: CommandsRegistry = {};

function register(definition: CommandDefinition) {
  commands[definition.key] = definition;
  if (definition.shortKey) {
    commands[definition.shortKey] = definition;
  }
}

function get(commandKey: string) : CommandDefinition {
  return commands[commandKey];
}

function getRegistry() : CommandsRegistry {
  return commands;
}

export default {
  register,
  get,
  getRegistry,
};
