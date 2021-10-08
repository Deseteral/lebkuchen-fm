import { Service } from 'typedi';
import Command from '../../model/command';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../../model/command-processing-response';
import XSoundsService from '../../../x-sounds/x-sounds-service';
import CommandProcessor from '../../model/command-processor';
import RegisterCommand from '../../registry/register-command';

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
    return makeSingleTextProcessingResponse(`Usunięto tag "${tagName}" z dźwięku ${soundName}`, false);
  }

  get key(): string {
    return 'tag-remove';
  }

  get shortKey(): string | null {
    return null;
  }

  get helpMessage(): string {
    return 'Usuwa tag z podanego dźwięku';
  }

  get helpUsages(): string[] | null {
    return [
      '<tag-name>|<sound name>',
      'fun stuff|airhorn',
    ];
  }
}

export default TagRemoveCommand;
