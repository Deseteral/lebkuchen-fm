import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import * as EventStreamService from '../../../event-stream/event-stream-service';
import { SkipEvent } from '../../../event-stream/model/events';

async function skipCommandProcessor() : Promise<CommandProcessingResponse> {
  const event: SkipEvent = { id: 'SkipEvent' };
  EventStreamService.sendToEveryone(event);
  return makeSingleTextProcessingResponse('Lecimy dalej!', false);
}

const skipCommandDefinition: CommandDefinition = {
  key: 'skip',
  processor: skipCommandProcessor,
  helpMessage: 'Pomija aktualnie odtwarzany utwór',
};

export default skipCommandDefinition;
