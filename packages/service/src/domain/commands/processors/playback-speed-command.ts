import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { ChangeSpeedEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class PlaybackSpeedCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const arg = command.rawArgs;
    let message: String;
    let event: ChangeSpeedEvent;

    switch (arg) {
      case '--':
        event = { id: 'ChangeSpeedEvent', nextSpeed: -1 };
        message = 'mniejszą';
        break;
      case '++':
        event = { id: 'ChangeSpeedEvent', nextSpeed: 1 };
        message = 'większą';
        break;
      case '1':
        event = { id: 'ChangeSpeedEvent', nextSpeed: 0 };
        message = 'normalną';
        break;
      default:
        throw new Error('Speed przyjmuje argumenty "--", "++" oraz "1"');
    }

    this.playerEventStream.sendToEveryone(event);

    return new CommandProcessingResponseBuilder()
      .fromMarkdown(`Lecimy z ${message} prędkością!`)
      .build();
  }

  get key(): string {
    return 'playback-speed';
  }

  get shortKey(): (string | null) {
    return 'speed';
  }

  get helpMessage(): string {
    return 'Zmienia prędkość odtwarzania';
  }

  get exampleUsages(): string[] {
    return [
      '--',
      '++',
      '1',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder()
      .withRequiredOr('"--"', '"++"', '"1"')
      .build();
  }
}

export { PlaybackSpeedCommand };
