import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { XSoundsService } from '@service/domain/x-sounds/x-sounds-service';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class TagShowCommand extends CommandProcessor {
  constructor(private xSoundsService: XSoundsService) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const soundName = command.rawArgs;
    if (!soundName) {
      throw new Error('Podaj nazwę dźwięku');
    }

    const tags = await this.xSoundsService.getSoundTags(soundName);

    if (tags.isEmpty()) {
      return new CommandProcessingResponseBuilder()
        .fromMarkdown(`Do dźwięku \`${soundName}\` nie ma przyspisanych żadnych tagów`)
        .build();
    }

    const tagListText = tags.map((tagName) => `- ${tagName}`);

    return new CommandProcessingResponseBuilder()
      .fromMultilineMarkdown(
        `*Tagi dla \`${soundName}\`*`,
        ...tagListText,
      )
      .build();
  }

  get key(): string {
    return 'tag-show';
  }

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Wyświetla wszystkie tagi przypisane do dźwięku';
  }

  get exampleUsages(): string[] {
    return [
      'airhorn',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder()
      .withRequired('sound-name')
      .build();
  }
}

export { TagShowCommand };
