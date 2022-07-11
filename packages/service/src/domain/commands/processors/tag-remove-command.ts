import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponses } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { XSoundsService } from '@service/domain/x-sounds/x-sounds-service';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class TagRemoveCommand extends CommandProcessor {
  constructor(private xSoundsService: XSoundsService) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const commandArgs = command.getArgsByDelimiter('|');

    if (commandArgs.length < 2) {
      throw new Error('Zbyt mała liczba argumentów');
    }

    const [tagName, soundName] = commandArgs;

    await this.xSoundsService.removeTag(soundName, tagName);
    return CommandProcessingResponses.markdown(`Usunięto tag \`${tagName}\` z dźwięku \`${soundName}\``);
  }

  get key(): string {
    return 'tag-remove';
  }

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Usuwa tag z podanego dźwięku';
  }

  get helpUsages(): (string[] | null) {
    return [
      '<tag-name>|<sound name>',
      'fun stuff|airhorn',
    ];
  }
}

export { TagRemoveCommand };
