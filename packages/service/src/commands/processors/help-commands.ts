import * as CommandRegistry from '../registry/command-registry';
import MessageBlock from '../message-block';
import CommandDefinition from '../registry/command-definition';

async function helpCommandProcessor() : Promise<MessageBlock[]> {
  const registry = CommandRegistry.getRegistry();
  return Object.keys(registry)
    .filter((objectKey) => (objectKey === registry[objectKey].key))
    .map((key) => registry[key])
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((definition) => {
      const shortKeyFragment = definition.shortKey ? ` [${definition.shortKey}]` : '';
      return `${definition.key}${shortKeyFragment}: ${definition.helpMessage}`;
    })
    .map((commandHelpText) => ({ type: 'PLAIN_TEXT', text: commandHelpText }));
}

const commandDefinition: CommandDefinition = {
  key: 'help',
  processor: helpCommandProcessor,
  helpMessage: 'Pokazuje tę wiadomość ;)',
};

export default commandDefinition;
