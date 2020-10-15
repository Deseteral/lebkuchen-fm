import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import * as EventStreamService from '../../../event-stream/event-stream-service';
import { SkipEvent } from '../../../event-stream/model/events';
import Command from '../model/command';

async function skipCommandProcessor(command: Command) : Promise<CommandProcessingResponse> {
  const all = command.rawArgs === 'all';
  const amount = parseInt(command.rawArgs, 10) ?? 1;
  const event: SkipEvent = { id: 'SkipEvent', all, amount };
  EventStreamService.sendToEveryone(event);
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
