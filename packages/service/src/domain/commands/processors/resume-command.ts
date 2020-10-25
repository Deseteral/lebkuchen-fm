import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import { ResumeEvent } from '../../../event-stream/model/events';

async function resumeCommandProcessor(): Promise<CommandProcessingResponse> {
  const event: ResumeEvent = { id: 'ResumeEvent' };
  PlayerEventStream.instance.sendToEveryone(event);

  return makeSingleTextProcessingResponse('Wznowiono odtwarzanie', false);
}

@CommandDefinition.register
export default class ResumeCommand implements CommandDefinition {
  key = 'resume';
  processor = resumeCommandProcessor;
  helpMessage = 'Wznawia odtwarzanie aktualnego utworu';
}
