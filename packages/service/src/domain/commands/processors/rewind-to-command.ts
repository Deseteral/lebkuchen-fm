import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { RewindToEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { parseToSeconds } from '@service/utils/utils';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class RewindToCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const timeArgument = command.rawArgs;
    if (!timeArgument) {
      throw new Error('You have to provide time to skip');
    }

    const time = parseToSeconds(timeArgument);

    if (time === null) {
      throw new Error('Wrong argument. You have to provide time in seconds or hh:mm:ss format.');
    }
    const event: RewindToEvent = {
      id: 'RewindToEvent',
      time,
    };

    this.playerEventStream.sendToEveryone(event);

    return new CommandProcessingResponseBuilder()
      .fromMarkdown(`Przewijamy do ${timeArgument}`)
      .build();
  }

  get key(): string {
    return 'rewind-to';
  }

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Przewija filmik do x sekund';
  }

  get exampleUsages(): string[] {
    return [
      '10',
      '90',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder()
      .withRequired('time')
      .build();
  }
}

export { RewindToCommand };
