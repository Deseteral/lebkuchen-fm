import * as CommandRegistry from '../registry/command-registry';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse from '../model/command-processing-response';

function notNull<T>(value: T | null | undefined): value is T {
  return ((value !== null) && (value !== undefined));
}

function getAllUniqueCommands(): CommandDefinition[] {
  const registry = CommandRegistry.getRegistry();
  return Array.from(registry.keys())
    .filter((objectKey) => (objectKey === registry.get(objectKey)?.key))
    .map((key) => registry.get(key))
    .filter(notNull)
    .sort((a, b) => a.key.localeCompare(b.key));
}

async function helpCommandProcessor(): Promise<CommandProcessingResponse> {
  const text = getAllUniqueCommands()
    .map((definition) => {
      const { key, shortKey, helpMessage } = definition;
      const shortKeyFragment = (shortKey ? ` [${shortKey}]` : '');
      return `\`${key}${shortKeyFragment}\`: ${helpMessage}`;
    })
    .join('\n');

  return {
    messages: [{ type: 'MARKDOWN', text }],
    isVisibleToIssuerOnly: false,
  };
}

const helpCommandDefinition: CommandDefinition = {
  key: 'help',
  processor: helpCommandProcessor,
  helpMessage: 'Pokazuje tę wiadomość ;)',
};

export default helpCommandDefinition;
