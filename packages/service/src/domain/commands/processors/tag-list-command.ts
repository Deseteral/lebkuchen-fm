import { Service } from 'typedi';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import Command from '../model/command';
import XSoundsService from '../../x-sounds/x-sounds-service';
import CommandProcessor from '../model/command-processor';
import RegisterCommand from '../registry/register-command';

@RegisterCommand
@Service()
class TagListCommand extends CommandProcessor {
  constructor(private xSoundService: XSoundsService) {
    super();
  }

  async execute(_: Command): Promise<CommandProcessingResponse> {
    const tags = await this.xSoundService.getAllUniqueTags();

    if (tags.length === 0) {
      return makeSingleTextProcessingResponse('Aktualnie nie ma żadnych tagów', false);
    }

    const tagListText = tags
      .map((tagName) => `- ${tagName}`)
      .join('\n');

    return {
      messages: [
        { type: 'HEADER', text: 'Wszystkie tagi' },
        { type: 'MARKDOWN', text: tagListText },
      ],
      isVisibleToIssuerOnly: false,
    };
  }

  get key(): string {
    return 'tag-list';
  }

  get shortKey(): string | null {
    return 'tl';
  }

  get helpMessage(): string {
    return 'Wyświetla wszystkie unikatowe tagi';
  }

  get helpUsages(): string[] | null {
    return null;
  }
}

export default TagListCommand;
