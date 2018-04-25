import CommandDefinition from '../domain/CommandDefinition';
import CommandRegistry from './registry/CommandRegistry';

async function help(parameterComponent: string) : Promise<string> {
  const commandRegistry = CommandRegistry.getRegistry();
  const message = Object.keys(commandRegistry)
    .map(key => commandRegistry[key])
    .map(definition => `- ${definition.key}: ${definition.helpMessage}`)
    .join('\n');

  return message;
}

const commandDefinition: CommandDefinition = {
  key: 'help',
  process: help,
  helpMessage: 'Pokazuje tę wiadomość ;)',
};

export default commandDefinition;
