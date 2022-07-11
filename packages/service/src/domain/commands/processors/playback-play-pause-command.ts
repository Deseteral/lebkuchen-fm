import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponses } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { PlayPauseEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class PlayPauseCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(_: Command): Promise<CommandProcessingResponse> {
    const event: PlayPauseEvent = { id: 'PlayPauseEvent' };
    this.playerEventStream.sendToEveryone(event);

    return CommandProcessingResponses.markdown('Spauzowano muzykę');
  }

  get key(): string {
    return 'playback-play-pause';
  }

  get shortKey(): (string | null) {
    return 'play';
  }

  get helpMessage(): string {
    return 'Odtwarza/zatrzymuje bieżący film';
  }

  get helpUsages(): (string[] | null) {
    return null;
  }
}

export { PlayPauseCommand };
