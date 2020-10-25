import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import XSoundService from '../../x-sounds/x-sounds-service';
import { PlayXSoundEvent } from '../../../event-stream/model/events';
import PlayerEventStream from '../../../event-stream/player-event-stream';

async function xCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const soundName = command.rawArgs;
  const xSound = await XSoundService.instance.getByName(soundName);

  const playXSoundEvent: PlayXSoundEvent = {
    id: 'PlayXSoundEvent',
    soundUrl: xSound.url,
  };

  PlayerEventStream.instance.sendToEveryone(playXSoundEvent);
  XSoundService.instance.incrementPlayCount(xSound.name);

  return makeSingleTextProcessingResponse(':ultrafastparrot:', false);
}

@CommandDefinition.register
export default class XCommand implements CommandDefinition {
  key = 'x';
  processor = xCommandProcessor;
  helpMessage = 'Puszcza szalony dźwięk!';
  helpUsages = [
    '<sound name>',
    'airhorn',
  ];
}
