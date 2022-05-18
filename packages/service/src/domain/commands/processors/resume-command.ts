import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, makeSingleTextProcessingResponse } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { ResumeEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class ResumeCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(_: Command): Promise<CommandProcessingResponse> {
    const event: ResumeEvent = { id: 'ResumeEvent' };
    this.playerEventStream.sendToEveryone(event);

    return makeSingleTextProcessingResponse('Wznowiono odtwarzanie');
  }

  get key(): string {
    return 'resume';
  }

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Wznawia odtwarzanie aktualnego utworu';
  }

  get helpUsages(): (string[] | null) {
    return null;
  }
}

export { ResumeCommand };
