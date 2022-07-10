import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponses } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { CommandRegistryService } from '@service/domain/commands/registry/command-registry-service';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
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

    const commandLines: string[] = uniqueCommands.map((definition) => {
      const { key, shortKey } = definition;
      const shortKeyFragment = shortKey
        ? ` [${shortKey}]`
        : '';

      return `  ${key}${shortKeyFragment}`;
    });

    return CommandProcessingResponses.markdown(
      '```LebkuchenFM help',
      '',
      'Commands:',
      ...commandLines,
      '```',
    );
  }

  private getAllUniqueCommands(): CommandProcessor[] {
    const registry = this.commandRegistryService.getRegistry();

    return Array.from(registry.keys())
      .filter((objectKey) => (objectKey === registry.get(objectKey)?.key))
      .map((key) => registry.get(key))
      .filter(notNull)
      .sort((a, b) => a.key.localeCompare(b.key));
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
