import * as CommandRegistry from '../registry/command-registry';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { MessageBlock } from '../model/command-processing-response';

function getAllUniqueCommands(): CommandDefinition[] {
  const registry = CommandRegistry.getRegistry();
  return Object.keys(registry)
    .filter((objectKey) => (objectKey === registry[objectKey].key))
    .map((key) => registry[key])
    .sort((a, b) => a.key.localeCompare(b.key));
}

async function helpCommandProcessor(): Promise<CommandProcessingResponse> {
  const messages: MessageBlock[] = getAllUniqueCommands()
    .map((definition) => {
      const { key, shortKey, helpMessage } = definition;
      const shortKeyFragment = (shortKey ? ` [${shortKey}]` : '');
      return `${key}${shortKeyFragment}: ${helpMessage}`;
    })
    .map((commandHelpText) => ({ type: 'PLAIN_TEXT', text: commandHelpText }));

  return {
    messages,
    isVisibleToIssuerOnly: false,
  };
}

const helpCommandDefinition: CommandDefinition = {
  key: 'help',
  processor: helpCommandProcessor,
  helpMessage: 'Pokazuje tę wiadomość ;)',
};

export default helpCommandDefinition;
