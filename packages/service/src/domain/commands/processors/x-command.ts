import { Service } from 'typedi';
import Command from '../model/command';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import { PlayXSoundEvent } from '../../../event-stream/model/events';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import CommandProcessor from '../model/command-processor';
import XSoundsService from '../../x-sounds/x-sounds-service';
import RegisterCommand from '../registry/register-command';

@RegisterCommand
@Service()
class XCommand extends CommandProcessor {
  constructor(private xSoundService: XSoundsService, private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const soundName = command.rawArgs.trim();
    if (!soundName) {
      throw new Error('Podaj nazwę dźwięku');
    }

    const xSound = await this.xSoundService.getByName(soundName);

    const playXSoundEvent: PlayXSoundEvent = {
      id: 'PlayXSoundEvent',
      soundUrl: xSound.url,
    };

    this.playerEventStream.sendToEveryone(playXSoundEvent);
    this.xSoundService.incrementPlayCount(xSound.name);

    return makeSingleTextProcessingResponse(':ultrafastparrot:', false);
  }

  get key(): string {
    return 'x';
  }

  get shortKey(): string | null {
    return null;
  }

  get helpMessage(): string {
    return 'Puszcza szalony dźwięk!';
  }

  get helpUsages(): string[] | null {
    return [
      '<sound name>',
      'airhorn',
    ];
  }
}

export default XCommand;
