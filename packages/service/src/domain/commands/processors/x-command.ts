import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import * as XSoundService from '../../x-sounds/x-sounds-service';
import { PlayXSoundEvent } from '../../../event-stream/events';
import * as EventStreamService from '../../../event-stream/event-stream-service';

async function xCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const soundName = command.rawArgs;
  const xSound = await XSoundService.getByName(soundName);

  const playXSoundEvent: PlayXSoundEvent = {
    id: 'PlayXSoundEvent',
    soundUrl: xSound.url,
  };

  EventStreamService.broadcast(playXSoundEvent);
  XSoundService.incrementPlayCount(xSound.name);

  return makeSingleTextProcessingResponse(':ultrafastparrot:', false);
}

const xCommandDefinition: CommandDefinition = {
  key: 'x',
  processor: xCommandProcessor,
  helpMessage: 'Puszcza szalony dźwięk! :parrot:',
};

export default xCommandDefinition;
