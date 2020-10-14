import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import * as EventStreamService from '../../../event-stream/event-stream-service';
import { ResumeEvent } from '../../../event-stream/model/events';

async function resumeCommandProcessor(): Promise<CommandProcessingResponse> {
  const event: ResumeEvent = { id: 'ResumeEvent' };
  EventStreamService.broadcast(event);

  return makeSingleTextProcessingResponse('Wznowiono odtwarzanie', false);
}

const resumeCommandDefinition: CommandDefinition = {
  key: 'resume',
  processor: resumeCommandProcessor,
  helpMessage: 'Wznawia odtwarzanie aktualnego utworu',
};

export default resumeCommandDefinition;
