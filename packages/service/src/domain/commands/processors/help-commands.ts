import * as CommandRegistry from '../registry/command-registry';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { MessageBlock } from '../model/command-processing-response';

async function helpCommandProcessor(): Promise<CommandProcessingResponse> {
  const registry = CommandRegistry.getRegistry();

  const messages: MessageBlock[] = Object.keys(registry)
    .filter((objectKey) => (objectKey === registry[objectKey].key))
    .map((key) => registry[key])
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((definition) => {
      const shortKeyFragment = definition.shortKey ? ` [${definition.shortKey}]` : '';
      return `${definition.key}${shortKeyFragment}: ${definition.helpMessage}`;
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
