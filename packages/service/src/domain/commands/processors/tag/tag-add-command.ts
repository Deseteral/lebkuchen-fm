import { Service } from 'typedi';
import Command from '@service/domain/commands/model/command';
import { CommandProcessingResponse, makeSingleTextProcessingResponse } from '@service/domain/commands/model/command-processing-response';
import CommandProcessor from '@service/domain/commands/model/command-processor';
import RegisterCommand from '@service/domain/commands/registry/register-command';
import XSoundsService from '@service/domain/x-sounds/x-sounds-service';

@RegisterCommand
@Service()
class TagAddCommand extends CommandProcessor {
  constructor(private xSoundsService: XSoundsService) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const commandArgs = command.getArgsByDelimiter('|');

    if (commandArgs.length < 2) {
      throw new Error('Zbyt mała liczba argumentów');
    }

    const [tagName, soundName] = commandArgs;

    await this.xSoundsService.addTag(soundName, tagName);
    return makeSingleTextProcessingResponse(`Dodano tag "${tagName}" do dźwięku ${soundName}`, false);
  }

  get key(): string {
    return 'tag-add';
  }

  get shortKey(): string | null {
    return 'ta';
  }

  get helpMessage(): string {
    return 'Dodaje tag do podanego dźwięku';
  }

  get helpUsages(): (string[] | null) {
    return [
      '<tag-name>|<sound name>',
      'fun stuff|airhorn',
    ];
  }
}

export default TagAddCommand;
