import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { PlayerStateRequestEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { PlayerState, CurrentlyPlaying } from '@service/domain/player-state/player-state';
import { Service } from 'typedi';
import { Song } from '@service/lib';

@RegisterCommand
@Service()
class PlaybackCurrentCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const includeQueue = command.rawArgs?.includes('queue') ?? false;
    const includePreview = command.rawArgs?.includes('embed') ?? false;

    const playerStateRequest: PlayerStateRequestEvent = { id: 'PlayerStateRequestEvent' };
    const currentPlayerState: PlayerState = await this.playerEventStream.sendToPrimaryPlayer(playerStateRequest);

    const text = this.buildMessage(
      currentPlayerState.currentlyPlaying ?? null,
      currentPlayerState.queue ?? [],
      includeQueue,
      includePreview,
    );

    return new CommandProcessingResponseBuilder()
      .fromMarkdown(text)
      .build();
  }

  private buildMessage(current: (CurrentlyPlaying | null), queue: Song[], includeQueue: Boolean, includePreview: Boolean): string {
    const songMessage = this.getCurrentSongMessageLines(current, includePreview);
    const queueSongsTitles = includeQueue ? queue.map((song) => `- ${song.name.truncated(50, false)}`) : [];
    const queueTitle = !queueSongsTitles.isEmpty() ? 'W kolejce:' : 'Playlista jest pusta';

    const text = [
      ...songMessage,
      includeQueue ? queueTitle : '',
      ...queueSongsTitles,
    ].filter(Boolean).join('\n');
    return text;
  }

  private getCurrentSongMessageLines(current: (CurrentlyPlaying | null), includePreview: Boolean): string[] {
    if (!current) { return ['Obecnie nic nie gramy.']; }

    const youtubeUrl = `https://www.youtube.com/watch?v=${current.song.youtubeId}&t=${current.time.toFixed(0)}`;
    const currentSongUrl = includePreview ? youtubeUrl : `<${youtubeUrl}>`;

    return [
      'Obecnie gramy:',
      `  [${current.song.name}](${currentSongUrl})`,
    ];
  }

  get key(): string {
    return 'playback-current';
  }

  get shortKey(): (string | null) {
    return 'current';
  }

  get helpMessage(): string {
    return 'Pokazuje utwór załadowany w playerze oraz opcjonalnie kolejkę.';
  }

  get exampleUsages(): string[] {
    return [
      '',
      'queue',
      'queue embed',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder().buildEmpty();
  }
}

export { PlaybackCurrentCommand };
