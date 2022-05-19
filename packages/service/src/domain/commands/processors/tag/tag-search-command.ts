import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, makeSingleTextProcessingResponse } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { XSoundsService } from '@service/domain/x-sounds/x-sounds-service';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class TagSearchCommand extends CommandProcessor {
  constructor(private xSoundsService: XSoundsService) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const tagName = command.rawArgs.trim();
    if (!tagName) {
      throw new Error('Podaj nazwę tagu');
    }

    const sounds = await this.xSoundsService.getAllByTag(tagName);

    if (sounds.isEmpty()) {
      return makeSingleTextProcessingResponse(`Nie ma dźwięków z tagiem "${tagName}"`);
    }

    const tagListText = sounds
      .map((sound) => sound.name)
      .map((soundName) => `- ${soundName}`)
      .join('\n');

    return {
      messages: [
        { type: 'HEADER', text: `Dźwięki z tagiem "${tagName}"` },
        { type: 'MARKDOWN', text: tagListText },
      ],
      isVisibleToIssuerOnly: false,
    };
  }

  get key(): string {
    return 'tag-search';
  }

  get shortKey(): (string | null) {
    return 'ts';
  }

  get helpMessage(): string {
    return 'Wyszukuje dźwięki z danym tagiem';
  }

  get helpUsages(): (string[] | null) {
    return [
      '<tag name>',
      'fun stuff',
    ];
  }
}

export { TagSearchCommand };
