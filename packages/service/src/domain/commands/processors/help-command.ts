import Command from '@service/domain/commands/model/command';
import { CommandProcessingResponse, MessageBlock } from '@service/domain/commands/model/command-processing-response';
import CommandProcessor from '@service/domain/commands/model/command-processor';
import CommandRegistryService from '@service/domain/commands/registry/command-registry-service';
import RegisterCommand from '@service/domain/commands/registry/register-command';
import Configuration from '@service/infrastructure/configuration';
import { notNull } from '@service/utils';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class HelpCommand extends CommandProcessor {
  constructor(private commandRegistryService: CommandRegistryService, private configuration: Configuration) {
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
        const prompt = this.configuration.COMMAND_PROMPT;
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

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Pokazuje tę wiadomość';
  }

  get helpUsages(): (string[] | null) {
    return null;
  }
}

export default HelpCommand;
