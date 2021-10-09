import { Service } from 'typedi';
import { CommandProcessingResponse, makeSingleTextProcessingResponse } from '../model/command-processing-response';
import { PauseEvent } from '../../../event-stream/model/events';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import CommandProcessor from '../model/command-processor';
import Command from '../model/command';
import RegisterCommand from '../registry/register-command';

@RegisterCommand
@Service()
class PauseCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(_: Command): Promise<CommandProcessingResponse> {
    const event: PauseEvent = { id: 'PauseEvent' };
    this.playerEventStream.sendToEveryone(event);

    return makeSingleTextProcessingResponse('Spauzowano muzykę', false);
  }

  get key(): string {
    return 'pause';
  }

  get shortKey(): string | null {
    return null;
  }

  get helpMessage(): string {
    return 'Zatrzymuje odtwarzanie bieżącego filmu';
  }

  get helpUsages(): (string[] | null) {
    return null;
  }
}

export default PauseCommand;
