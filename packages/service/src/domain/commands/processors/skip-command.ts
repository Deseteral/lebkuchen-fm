import { Service } from 'typedi';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import { SkipEvent } from '../../../event-stream/model/events';
import Command from '../model/command';
import CommandProcessor from '../model/command-processor';
import RegisterCommand from '../registry/register-command';

@RegisterCommand
@Service()
class SkipCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const skipAll = command.rawArgs === 'all';
    const amount = (command.rawArgs === '')
      ? 1
      : parseInt(command.rawArgs, 10);

    if ((Number.isNaN(amount) || amount < 1) && !skipAll) {
      throw new Error('Skip akceptuje liczby naturalne lub argument "all"');
    }

    const event: SkipEvent = { id: 'SkipEvent', skipAll, amount: amount || 1 };
    this.playerEventStream.sendToEveryone(event);
    return makeSingleTextProcessingResponse('Lecimy dalej!', false);
  }

  get key(): string {
    return 'skip';
  }

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Pomija utwory';
  }

  get helpUsages(): (string[] | null) {
    return [
      '[amount; defaults to 1]',
      '3',
      'all',
    ];
  }
}

export default SkipCommand;
