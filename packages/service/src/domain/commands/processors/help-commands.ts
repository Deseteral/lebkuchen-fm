import CommandRegistry from '../registry/command-registry';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { MessageBlock } from '../model/command-processing-response';
import Configuration from '../../../infrastructure/configuration';

function notNull<T>(value: T | null | undefined): value is T {
  return ((value !== null) && (value !== undefined));
}

function formatDefinitionToMarkdown(definition: CommandDefinition): string {
  const { key, shortKey, helpMessage } = definition;
  const shortKeyFragment = shortKey
    ? ` \`[${shortKey}]\``
    : '';

  return [
    `\`${key}\`${shortKeyFragment}`,
    helpMessage,
  ].join('\n');
}

function getAllUniqueCommands(): CommandDefinition[] {
  const registry = CommandRegistry.instance.getRegistry();
  return Array.from(registry.keys())
    .filter((objectKey) => (objectKey === registry.get(objectKey)?.key))
    .map((key) => registry.get(key))
    .filter(notNull)
    .sort((a, b) => a.key.localeCompare(b.key));
}

async function helpCommandProcessor(): Promise<CommandProcessingResponse> {
  const uniqueCommands = getAllUniqueCommands();
  const messages: MessageBlock[] = [
    { type: 'HEADER', text: 'LebkuchenFM - komendy' },
  ];

  uniqueCommands.forEach((definition) => {
    messages.push({
      type: 'MARKDOWN',
      text: formatDefinitionToMarkdown(definition),
    });

    if (definition.helpUsages) {
      const prompt = Configuration.COMMAND_PROMPT;
      const text = definition.helpUsages
        .map((usage) => `${prompt} ${definition.key} ${usage}`)
        .join(', ');
      messages.push({ type: 'CONTEXT', text });
    }

    messages.push({ type: 'DIVIDER' });
  });

  return {
    messages,
    isVisibleToIssuerOnly: false,
  };
}

const helpCommandDefinition: CommandDefinition = {
  key: 'help',
  processor: helpCommandProcessor,
  helpMessage: 'Pokazuje tę wiadomość',
};

export default helpCommandDefinition;
