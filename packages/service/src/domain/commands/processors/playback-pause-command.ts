import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { PlayerPauseEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class PauseCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(_: Command): Promise<CommandProcessingResponse> {
    const event: PlayerPauseEvent = { id: 'PauseEvent' };
    this.playerEventStream.sendToEveryone(event);

    return new CommandProcessingResponseBuilder()
      .fromMarkdown('⏸️')
      .build();
  }

  get key(): string {
    return 'playback-pause';
  }

  get shortKey(): (string | null) {
    return 'pause';
  }

  get helpMessage(): string {
    return 'Zatrzymuje bieżący film';
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

export { PauseCommand as PlayPauseCommand };
