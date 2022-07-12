import { Service } from 'typedi';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponses } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { XSoundsService } from '@service/domain/x-sounds/x-sounds-service';

@RegisterCommand
@Service()
class XListCommand extends CommandProcessor {
  constructor(private xSoundService: XSoundsService) {
    super();
  }

  async execute(_: Command): Promise<CommandProcessingResponse> {
    const sounds = await this.xSoundService.getAll();

    if (sounds.isEmpty()) {
      throw new Error('Brak dźwięków w bazie');
    }

    const soundListText = sounds.map((sound) => `- \`${sound.name}\``);

    return CommandProcessingResponses.markdown(
      '*X Sounds list*',
      ...soundListText,
    );
  }

  get key(): string {
    return 'x-list';
  }

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Wypisuje listę czaderskich dźwięków w bazie';
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

export { XListCommand };
