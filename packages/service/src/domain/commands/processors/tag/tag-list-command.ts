import { Service } from 'typedi';
import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponses } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { XSoundsService } from '@service/domain/x-sounds/x-sounds-service';

@RegisterCommand
@Service()
class TagListCommand extends CommandProcessor {
  constructor(private xSoundService: XSoundsService) {
    super();
  }

  async execute(_: Command): Promise<CommandProcessingResponse> {
    const tags = await this.xSoundService.getAllUniqueTags();

    if (tags.isEmpty()) {
      return CommandProcessingResponses.markdown('Aktualnie nie ma żadnych tagów');
    }

    const tagListText = tags.map((tagName) => `- ${tagName}`);

    return CommandProcessingResponses.markdown(
      '*Wszystkie tagi*',
      ...tagListText,
    );
  }

  get key(): string {
    return 'tag-list';
  }

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Wyświetla wszystkie unikatowe tagi';
  }

  get helpUsages(): (string[] | null) {
    return null;
  }
}

export { TagListCommand };
