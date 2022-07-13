import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponses } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { CommandRegistryService } from '@service/domain/commands/registry/command-registry-service';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { Configuration } from '@service/infrastructure/configuration';
import { notNull } from '@service/utils/utils';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class HelpCommand extends CommandProcessor {
  constructor(private commandRegistryService: CommandRegistryService, private configuration: Configuration) {
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

    const exampleText = definition.exampleUsages
      .map((usage) => `${this.configuration.COMMAND_PROMPT} ${commandName} ${usage}`)
      .map((usage) => `  ${usage}`)
      .join('\n');

    return CommandProcessingResponses.markdown(
      '```',
      this.getCommandWithParamsLine(definition),
      '',
      `> ${definition.helpMessage}`,
      '',
      'Examples:',
      exampleText,
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
      '```',
      'LebkuchenFM',
      '',
      `For command specific information use \`${this.configuration.COMMAND_PROMPT} help <command name>\``,
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
      ? ` (${shortKey})`
      : '';

    return `${key}${shortKeyFragment}`;
  }

  private getCommandWithParamsLine(definition: CommandProcessor): string {
    const { key, parameters } = definition;

    const paramsText = parameters.parameters
      .map((param) => (param.required ? `<${param.names.join(' | ')}>` : `[${param.names.join(' | ')}]`))
      .join(parameters.delimeter || '');

    return `${key} ${paramsText}`;
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

  get exampleUsages(): string[] {
    return [
      '',
      'song-random',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder()
      .withOptional('command-name')
      .build();
  }
}

export { HelpCommand };
