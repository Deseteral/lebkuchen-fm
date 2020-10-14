import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import * as EventStreamService from '../../../event-stream/event-stream-service';
import { PauseEvent } from '../../../event-stream/model/events';

async function pauseCommandProcessor(): Promise<CommandProcessingResponse> {
  const event: PauseEvent = { id: 'PauseEvent' };
  EventStreamService.sendToEveryone(event);

  return makeSingleTextProcessingResponse('Spauzowano muzykę', false);
}

const pauseCommandDefinition: CommandDefinition = {
  key: 'pause',
  processor: pauseCommandProcessor,
  helpMessage: 'Zatrzymuje odtwarzanie bieżącego filmu',
};

export default pauseCommandDefinition;
