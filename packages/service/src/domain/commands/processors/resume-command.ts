import { Service } from 'typedi';
import { CommandProcessingResponse, makeSingleTextProcessingResponse } from '../model/command-processing-response';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import { ResumeEvent } from '../../../event-stream/model/events';
import CommandProcessor from '../model/command-processor';
import Command from '../model/command';
import RegisterCommand from '../registry/register-command';

@RegisterCommand
@Service()
class ResumeCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(_: Command): Promise<CommandProcessingResponse> {
    const event: ResumeEvent = { id: 'ResumeEvent' };
    this.playerEventStream.sendToEveryone(event);

    return makeSingleTextProcessingResponse('Wznowiono odtwarzanie', false);
  }

  get key(): string {
    return 'resume';
  }

  get shortKey(): string | null {
    return null;
  }

  get helpMessage(): string {
    return 'Wznawia odtwarzanie aktualnego utworu';
  }

  get helpUsages(): string[] | null {
    return null;
  }
}

export default ResumeCommand;
