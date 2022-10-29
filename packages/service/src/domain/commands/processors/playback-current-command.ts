import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { PlayerStateRequestEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { PlayerState } from '@service/domain/player-state/player-state';
import { Service } from 'typedi';
import { Song } from '@service/lib';

@RegisterCommand
@Service()
class PlaybackCurrentCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const includeQueue = command.rawArgs === 'queue';

    const playerStateRequest: PlayerStateRequestEvent = { id: 'PlayerStateRequestEvent' };
    const currentPlayerState: PlayerState = await this.playerEventStream.sendToPrimaryPlayer(playerStateRequest);

    const text = this.buildMessage(
      currentPlayerState.currentlyPlaying?.song ?? null,
      currentPlayerState.queue ?? [],
      includeQueue,
    );

    return new CommandProcessingResponseBuilder()
      .fromMarkdown(text)
      .build();
  }

  private buildMessage(current: (Song | null), queue: Song[], includeQueue: Boolean): string {
    const queueSongsTitles = includeQueue ? queue.map((song) => `  - ${song.name.truncated(50, false)}`) : [];
    const queueTitle = !queueSongsTitles.isEmpty() ? 'W kolejce:' : 'Playlista jest pusta';
    const currentSongName = current?.name ?? '';

    const text = [
      currentSongName ? 'Obecnie gramy:' : 'Obecnie nic nie gramy.',
      currentSongName ? `  ${currentSongName}` : '',
      includeQueue ? queueTitle : '',
      ...queueSongsTitles,
    ].filter(Boolean).join('\n');
    return text;
  }

  get key(): string {
    return 'playback-current';
  }

  get shortKey(): (string | null) {
    return 'current';
  }

  get helpMessage(): string {
    return 'Pokazuje utwór załadowany w playerze oraz opcjonalnie kolejkę';
  }

  get exampleUsages(): string[] {
    return [
      '',
      'queue',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder().buildEmpty();
  }
}

export { PlaybackCurrentCommand };
