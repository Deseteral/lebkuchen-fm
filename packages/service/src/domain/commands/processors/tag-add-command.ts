import { Service } from 'typedi';
import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { XSoundsService } from '@service/domain/x-sounds/x-sounds-service';

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
    return new CommandProcessingResponseBuilder()
      .fromMarkdown(`Dodano tag \`${tagName}\` do dźwięku \`${soundName}\``)
      .build();
  }

  get key(): string {
    return 'tag-add';
  }

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Dodaje tag do podanego dźwięku';
  }

  get exampleUsages(): string[] {
    return [
      'fun stuff|airhorn',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder()
      .withRequired('tag-name')
      .withRequired('sound-name')
      .withDelimeter('|')
      .build();
  }
}

export { TagAddCommand };
