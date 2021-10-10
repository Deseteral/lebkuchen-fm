import { Service } from 'typedi';
import Command from '@service/domain/commands/model/command';
import { CommandProcessingResponse, makeSingleTextProcessingResponse } from '@service/domain/commands/model/command-processing-response';
import CommandProcessor from '@service/domain/commands/model/command-processor';
import RegisterCommand from '@service/domain/commands/registry/register-command';
import XSoundsService from '@service/domain/x-sounds/x-sounds-service';

@RegisterCommand
@Service()
class TagListCommand extends CommandProcessor {
  constructor(private xSoundService: XSoundsService) {
    super();
  }

  async execute(_: Command): Promise<CommandProcessingResponse> {
    const tags = await this.xSoundService.getAllUniqueTags();

    if (tags.isEmpty()) {
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

  get helpUsages(): (string[] | null) {
    return null;
  }
}

export default TagListCommand;
