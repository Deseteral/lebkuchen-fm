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

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const commandName = command.rawArgs;
    return commandName
      ? this.helpWithCommand(commandName)
      : this.helpWithoutCommand();
  }

  private helpWithCommand(commandName: string): CommandProcessingResponse {
    const registry = this.commandRegistryService.getRegistry();
    const definition = registry.get(commandName);

    if (!definition) {
      throw new Error('No such command');
    }

    return CommandProcessingResponses.markdown(
      '```markdown',
      this.getCommandHelpLine(definition),
      definition.helpMessage,
      '',
      definition.exampleUsages?.join(' ') || '',
      '```',
    );
  }

  private helpWithoutCommand(): CommandProcessingResponse {
    const uniqueCommands = this.getAllUniqueCommands();
    const groups: {[groupKey: string]: string[]} = {};

    uniqueCommands.forEach((definition) => {
      const groupKey = definition.key.split('-')[0];
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(`  ${this.getCommandHelpLine(definition)}`);
    });

    const groupsText = Object.values(groups)
      .map((group) => group.join('\n'))
      .join('\n\n');

    return CommandProcessingResponses.markdown(
      '```markdown',
      '*LebkuchenFM*',
      'For command specific information use `help <command name>`',
      '',
      'Commands:',
      groupsText,
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

  private getCommandHelpLine(definition: CommandProcessor): string {
    const { key, shortKey } = definition;
    const shortKeyFragment = shortKey
      ? ` [${shortKey}]`
      : '';

    return `${key}${shortKeyFragment}`;
  }

  get key(): string {
    return 'help';
  }

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Wyświetla dostępne komendy oraz przykłady ich użycia';
  }

  get exampleUsages(): (string[] | null) {
    return [
      '',
      '<command name>',
      'song-random',
    ];
  }
}

export { HelpCommand };
