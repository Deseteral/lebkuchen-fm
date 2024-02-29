import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { PlayerResumeEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class PlayCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(_: Command): Promise<CommandProcessingResponse> {
    const event: PlayerResumeEvent = { id: 'ResumeEvent' };
    this.playerEventStream.sendToEveryone(event);

    return new CommandProcessingResponseBuilder()
      .fromMarkdown('▶️')
      .build();
  }

  get key(): string {
    return 'playback-resume';
  }

  get shortKey(): (string | null) {
    return 'resume';
  }

  get helpMessage(): string {
    return 'Wznawia otwarzanie zatrzymanego lub zakończonego wideo';
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

export { PlayCommand as PlayPauseCommand };
