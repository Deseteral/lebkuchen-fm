import { Service } from 'typedi';
import { CommandProcessingResponse, makeSingleTextProcessingResponse } from '../model/command-processing-response';
import { ChangeSpeedEvent } from '../../../event-stream/model/events';
import Command from '../model/command';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import CommandProcessor from '../model/command-processor';
import RegisterCommand from '../registry/register-command';

@RegisterCommand
@Service()
class SpeedCommand extends CommandProcessor {
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
    return makeSingleTextProcessingResponse(`Lecimy z ${message} prędkością!`, false);
  }

  get key(): string {
    return 'speed';
  }

  get shortKey(): string | null {
    return null;
  }

  get helpMessage(): string {
    return 'Zmienia prędkość odtwarzania';
  }

  get helpUsages(): string[] | null {
    return [
      '--',
      '++',
      '1 (resetuje)',
    ];
  }
}

export default SpeedCommand;
