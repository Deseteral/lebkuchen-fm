import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import * as EventStreamService from '../../../event-stream/event-stream-service';
import { SkipEvent } from '../../../event-stream/model/events';
import Command from '../model/command';

async function skipCommandProcessor(command: Command) : Promise<CommandProcessingResponse> {
  const all = command.rawArgs === 'all';
  const count = parseInt(command.rawArgs, 10);
  const event: SkipEvent = { id: 'SkipEvent', all, count };
  EventStreamService.sendToEveryone(event);
  return makeSingleTextProcessingResponse('Lecimy dalej!', false);
}

const skipCommandDefinition: CommandDefinition = {
  key: 'skip',
  processor: skipCommandProcessor,
  helpMessage: 'Pomija aktualnie odtwarzany utwór',
  helpUsages: [
    'skip',
    'skip 3',
    'skip all',
  ],
};

export default skipCommandDefinition;
