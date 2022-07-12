import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponses } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { ChangeVolumeEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class PlaybackVolumeCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const value = command.rawArgs;

    if (!value) throw new Error('You have to provide value');

    const isRelativeChange = (value.startsWith('+') || value.startsWith('-'));
    const parsedVolume = parseInt(value, 10);

    if (Number.isNaN(parsedVolume)) {
      throw new Error(`Nieprawidłowa głośność "${value}". Aby zmienić głośność podaj liczbę ze znakiem z przedziału [-100,+100] lub bez znaku z przedziału [0,100]`);
    }
    if (isRelativeChange && (parsedVolume < -100 || parsedVolume > 100)) {
      throw new Error(`Nieprawidłowa głośność względna "${value}", podaj liczbę (ze znakiem) z przedziału [-100,+100]`);
    }
    if (!isRelativeChange && (parsedVolume < 0 || parsedVolume > 100)) {
      throw new Error(`Nieprawidłowa głośność bezwzględna "${value}", podaj liczbę (bez znaku) z przedziału [0,100]`);
    }

    const event: ChangeVolumeEvent = {
      id: 'ChangeVolumeEvent',
      isRelative: isRelativeChange,
      nextVolume: parsedVolume,
    };
    this.playerEventStream.sendToEveryone(event);

    if (isRelativeChange) {
      return CommandProcessingResponses.markdown(`Zmieniono głośność o "${value}"`);
    }
    return CommandProcessingResponses.markdown(`Ustawiono głośność na "${value}"`);
  }

  get key(): string {
    return 'playback-volume';
  }

  get shortKey(): (string | null) {
    return 'volume';
  }

  get helpMessage(): string {
    return 'Ustawia głośność na zadaną z zakresu [0,100] lub zmienia głośność o zadaną wartość z zakresu [-100,+100]';
  }

  get exampleUsages(): (string[] | null) {
    return [
      '<volume from 1 to 100>',
      '<relative volume change from -100 to 100>',
      '55',
      '0',
      '+10',
      '-10',
    ];
  }
}

export { PlaybackVolumeCommand };
