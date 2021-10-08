import { Service } from 'typedi';
import CommandRegistryService from '../registry/command-registry-service';
import { CommandProcessingResponse, MessageBlock } from '../model/command-processing-response';
import Configuration from '../../../infrastructure/configuration';
import CommandProcessor from '../model/command-processor';
import Command from '../model/command';
import RegisterCommand from '../registry/register-command';

// TODO: Extract to some utilities module
function notNull<T>(value: T | null | undefined): value is T {
  return ((value !== null) && (value !== undefined));
}

@RegisterCommand
@Service()
class HelpCommand extends CommandProcessor {
  constructor(private commandRegistryService: CommandRegistryService) {
    super();
  }

  async execute(_: Command): Promise<CommandProcessingResponse> {
    const uniqueCommands = this.getAllUniqueCommands();
    const messages: MessageBlock[] = [
      { type: 'HEADER', text: 'LebkuchenFM - komendy' },
    ];

    uniqueCommands.forEach((definition) => {
      messages.push({
        type: 'MARKDOWN',
        text: this.formatDefinitionToMarkdown(definition),
      });

      if (definition.helpUsages) {
        const prompt = Configuration.COMMAND_PROMPT;
        const text = definition.helpUsages
          .map((usage) => `${prompt} ${definition.key} ${usage}`)
          .join(', ');
        messages.push({ type: 'CONTEXT', text });
      }
    });

    return {
      messages,
      isVisibleToIssuerOnly: false,
    };
  }

  private getAllUniqueCommands(): CommandProcessor[] {
    const registry = this.commandRegistryService.getRegistry();

    return Array.from(registry.keys())
      .filter((objectKey) => (objectKey === registry.get(objectKey)?.key))
      .map((key) => registry.get(key))
      .filter(notNull)
      .sort((a, b) => a.key.localeCompare(b.key));
  }

  private formatDefinitionToMarkdown(definition: CommandProcessor): string {
    const { key, shortKey, helpMessage } = definition;
    const shortKeyFragment = shortKey
      ? ` \`[${shortKey}]\``
      : '';

    return [
      `\`${key}\`${shortKeyFragment}`,
      helpMessage,
    ].join('\n');
  }

  get key(): string {
    return 'help';
  }

  get shortKey(): string | null {
    return null;
  }

  get helpMessage(): string {
    return 'Pokazuje tę wiadomość';
  }

  get helpUsages(): string[] | null {
    return null;
  }
}

export default HelpCommand;
