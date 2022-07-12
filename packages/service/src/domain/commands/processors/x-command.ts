import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponses } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { XSoundsService } from '@service/domain/x-sounds/x-sounds-service';
import { PlayXSoundEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class XCommand extends CommandProcessor {
  constructor(private xSoundService: XSoundsService, private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const soundName = command.rawArgs;
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

    return CommandProcessingResponses.markdown(`Played \`${soundName}\` sound`);
  }

  get key(): string {
    return 'x';
  }

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Puszcza szalony dźwięk!';
  }

  get exampleUsages(): (string[] | null) {
    return [
      '<sound name>',
      'airhorn',
    ];
  }
}

export { XCommand };
