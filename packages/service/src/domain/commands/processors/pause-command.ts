import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponses } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { PauseEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class PauseCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(_: Command): Promise<CommandProcessingResponse> {
    const event: PauseEvent = { id: 'PauseEvent' };
    this.playerEventStream.sendToEveryone(event);

    return CommandProcessingResponses.markdown('Spauzowano muzykę');
  }

  get key(): string {
    return 'pause';
  }

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Zatrzymuje odtwarzanie bieżącego filmu';
  }

  get helpUsages(): (string[] | null) {
    return null;
  }
}

export { PauseCommand };
