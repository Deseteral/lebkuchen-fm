import CommandDefinition from '../../domain/CommandDefinition';

interface CommandsRegistry {
  [key: string]: CommandDefinition;
}

const commands: CommandsRegistry = {};

function register(definition: CommandDefinition) {
  commands[definition.key] = definition;
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
