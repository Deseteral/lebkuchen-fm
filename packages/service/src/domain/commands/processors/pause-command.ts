import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import { PauseEvent } from '../../../event-stream/model/events';
import PlayerEventStream from '../../../event-stream/player-event-stream';

async function pauseCommandProcessor(): Promise<CommandProcessingResponse> {
  const event: PauseEvent = { id: 'PauseEvent' };
  PlayerEventStream.instance.sendToEveryone(event);

  return makeSingleTextProcessingResponse('Spauzowano muzykę', false);
}

const pauseCommandDefinition: CommandDefinition = {
  key: 'pause',
  processor: pauseCommandProcessor,
  helpMessage: 'Zatrzymuje odtwarzanie bieżącego filmu',
};

export default pauseCommandDefinition;
