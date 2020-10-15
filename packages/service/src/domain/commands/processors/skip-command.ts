import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import { SkipEvent } from '../../../event-stream/model/events';
import Command from '../model/command';

async function skipCommandProcessor(command: Command) : Promise<CommandProcessingResponse> {
  const skipAll = command.rawArgs === 'all';
  const amount = (command.rawArgs === '')
    ? 1
    : parseInt(command.rawArgs, 10);

  if ((Number.isNaN(amount) || amount < 1) && !skipAll) {
    throw new Error('Skip akceptuje liczby naturalne lub argument "all"');
  }

  const event: SkipEvent = { id: 'SkipEvent', skipAll, amount: amount || 1 };
  PlayerEventStream.instance.sendToEveryone(event);
  return makeSingleTextProcessingResponse('Lecimy dalej!', false);
}

const skipCommandDefinition: CommandDefinition = {
  key: 'skip',
  processor: skipCommandProcessor,
  helpMessage: 'Pomija utwory',
  helpUsages: [
    '[amount; defaults to 1]',
    '3',
    'all',
  ],
};

export default skipCommandDefinition;
