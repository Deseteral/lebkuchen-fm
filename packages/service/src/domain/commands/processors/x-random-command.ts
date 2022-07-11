import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponses } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { XSound } from '@service/domain/x-sounds/x-sound';
import { XSoundsService } from '@service/domain/x-sounds/x-sounds-service';
import { PlayXSoundEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class XRandomCommand extends CommandProcessor {
  constructor(private xSoundsService: XSoundsService, private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const commandArgs = command.getArgsByDelimiter(' ');
    const allXSounds = await this.xSoundsService.getAll();
    const xSoundsContainsEverySearchedWord = (xSound: XSound): boolean => commandArgs.every((word) => xSound.tags?.includes(word));
    const xSoundsFollowingCriteria = allXSounds.filter(xSoundsContainsEverySearchedWord).randomShuffle();

    if (xSoundsFollowingCriteria.isEmpty()) {
      const message = 'Nie znaleziono dźwięków spełniających kryteria.';
      throw new Error(message);
    }

    const xSoundToPlay = xSoundsFollowingCriteria[0];
    const eventData: PlayXSoundEvent = { id: 'PlayXSoundEvent', soundUrl: xSoundToPlay.url };
    this.playerEventStream.sendToEveryone(eventData);
    this.xSoundsService.incrementPlayCount(xSoundToPlay.name);

    return CommandProcessingResponses.markdown(`:ultrafastparrot: \`${xSoundToPlay.name}\``);
  }

  get key(): string {
    return 'x-random';
  }

  get shortKey(): (string | null) {
    return 'xr';
  }

  get helpMessage(): string {
    return 'Losuje dźwięk z bazy dźwięków. Parametr jest opcjonalny.';
  }

  get helpUsages(): (string[] | null) {
    return [
      '<tag>',
      'bomba',
      '',
    ];
  }
}

export { XRandomCommand };
