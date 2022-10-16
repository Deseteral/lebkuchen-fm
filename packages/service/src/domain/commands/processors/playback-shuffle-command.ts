import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { ReplaceQueueEvent, PlayerStateRequestEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { PlayerState } from '@service/domain/player-state/player-state';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class PlaybackShuffleCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(_: Command): Promise<CommandProcessingResponse> {
    const playerStateRequest: PlayerStateRequestEvent = { id: 'PlayerStateRequestEvent' };
    const currentPlayerState: PlayerState = await this.playerEventStream.sendToPrimaryPlayer(playerStateRequest);

    const replaceQueueEvent: ReplaceQueueEvent = { id: 'ReplaceQueueEvent', songs: currentPlayerState.queue.randomShuffle() };
    this.playerEventStream.sendToEveryone(replaceQueueEvent);

    return new CommandProcessingResponseBuilder()
      .fromMarkdown('Tasujemy playlistę!')
      .build();
  }

  get key(): string {
    return 'playback-shuffle';
  }

  get shortKey(): (string | null) {
    return 'shuffle';
  }

  get helpMessage(): string {
    return 'Tasuje utwory aktualnie znajdujące się w kolejce';
  }

  get exampleUsages(): string[] {
    return [
      '',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder().buildEmpty();
  }
}

export { PlaybackShuffleCommand };
