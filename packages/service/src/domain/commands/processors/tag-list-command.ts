import { Service } from 'typedi';
import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
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
      return new CommandProcessingResponseBuilder()
        .fromMarkdown('Aktualnie nie ma żadnych tagów')
        .build();
    }

    const tagListText = tags.map((tagName) => `- ${tagName}`);

    return new CommandProcessingResponseBuilder()
      .fromMultilineMarkdown(
        '*Wszystkie tagi*',
        ...tagListText,
      )
      .build();
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

  get exampleUsages(): string[] {
    return [
      '',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder().buildEmpty();
  }
}

export { TagListCommand };
