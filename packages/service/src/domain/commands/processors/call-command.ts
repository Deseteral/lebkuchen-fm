import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { Service } from 'typedi';
import { RadioPersonalityService } from '@service/domain/radio-personality/radio-personality-service';

@RegisterCommand
@Service()
class CallCommand extends CommandProcessor {
  constructor(private radioPersonalityService: RadioPersonalityService) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const text = command.rawArgs;

    if (!text) throw new Error('You have to provide message text');

    const response = await this.radioPersonalityService.onListenerCall(text);
    if (!response) {
      return new CommandProcessingResponseBuilder()
        .fromMarkdown('Prezenter radiowy jest teraz nie dostępny')
        .build();
    }

    return new CommandProcessingResponseBuilder()
      .fromMarkdown(`_"${response}"_`)
      .build();
  }

  get key(): string {
    return 'call';
  }

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Dzwoni do studia z wiadomością';
  }

  get exampleUsages(): string[] {
    return [
      'to jest moja fantastyczna wiadomość',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder()
      .withRequired('message')
      .build();
  }
}

export { CallCommand };
