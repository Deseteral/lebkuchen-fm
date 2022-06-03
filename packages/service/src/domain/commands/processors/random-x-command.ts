import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { XSound } from '@service/domain/x-sounds/x-sound';
import { XSoundsService } from '@service/domain/x-sounds/x-sounds-service';
import { PlayXSoundEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class RandomXCommand extends CommandProcessor {
  constructor(private xSoundsService: XSoundsService, private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const commandArgs = command.getArgsByDelimiter(' ');
    const { tags } = this.amountAndKeywordsFromArgs(commandArgs);

    const allXSounds = await this.xSoundsService.getAll();
    const xSoundsContainsEverySearchedWord = (xSound: XSound): boolean => tags.every((word) => xSound.tags?.includes(word.toLowerCase()));

    const xSoundsFollowingCriteria = allXSounds.filter(xSoundsContainsEverySearchedWord).randomShuffle();

    if (xSoundsFollowingCriteria.isEmpty()) {
      const message = 'Nie znaleziono dźwięków spełniających kryteria.';
      throw new Error(message);
    }

    const xSoundToPlay = xSoundsFollowingCriteria[0];

    const eventData: PlayXSoundEvent = { id: 'PlayXSoundEvent', soundUrl: xSoundToPlay.url };
    this.playerEventStream.sendToEveryone(eventData);

    this.xSoundsService.incrementPlayCount(xSoundToPlay.name);

    const text = this.buildMessage(xSoundToPlay.name);

    return {
      messages: [{
        text,
        type: 'MARKDOWN',
      }],
      isVisibleToIssuerOnly: false,
    };
  }

  private amountAndKeywordsFromArgs(args: string[]): { tags: string[] } {
    const argsCopy = Array.from(args);
    return { tags: argsCopy };
  }

  private buildMessage(xSoundName: string): string {
    const text = `Dodano ${xSoundName}$`;
    return text;
  }

  get key(): string {
    return 'random-x';
  }

  get shortKey(): (string | null) {
    return 'rx';
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

export { RandomXCommand };
