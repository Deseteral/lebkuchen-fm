import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
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
    const tagName = command.rawArgs;
    if (!tagName) {
      throw new Error('Podaj nazwę tagu');
    }

    const sounds = await this.xSoundsService.getAllByTag(tagName);

    if (sounds.isEmpty()) {
      return new CommandProcessingResponseBuilder()
        .fromMarkdown(`Nie ma dźwięków z tagiem \`${tagName}\``)
        .build();
    }

    const tagListText = sounds
      .map((sound) => sound.name)
      .map((soundName) => `- ${soundName}`);

    return new CommandProcessingResponseBuilder()
      .fromMultilineMarkdown(
        `*Dźwięki z tagiem \`${tagName}\`*`,
        ...tagListText,
      )
      .build();
  }

  get key(): string {
    return 'tag-search';
  }

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Wyszukuje dźwięki z danym tagiem';
  }

  get exampleUsages(): string[] {
    return [
      'fun stuff',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder()
      .withRequired('tag-name')
      .build();
  }
}

export { TagSearchCommand };
