import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, MessageBlock } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { CommandRegistryService } from '@service/domain/commands/registry/command-registry-service';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { Configuration } from '@service/infrastructure/configuration';
import { notNull } from '@service/utils/utils';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class HelpCommand extends CommandProcessor {
  constructor(private commandRegistryService: CommandRegistryService) {
    super();
  }

  async execute(_: Command): Promise<CommandProcessingResponse> {
    const uniqueCommands = this.getAllUniqueCommands();

    const messages: MessageBlock[] = uniqueCommands.map((definition) => ({
      type: 'MARKDOWN',
      text: this.formatDefinitionToMarkdown(definition),
    }));

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
    const { key, shortKey } = definition;
    const shortKeyFragment = shortKey
      ? ` \`[${shortKey}]\``
      : '';

    return `- \`${key}\`${shortKeyFragment}`;
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

export { HelpCommand };
