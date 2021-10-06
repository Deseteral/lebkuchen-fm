import { Container } from 'typedi';
import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import XSoundService from '../../x-sounds/x-sounds-service';
import { PlayXSoundEvent } from '../../../event-stream/model/events';
import PlayerEventStream from '../../../event-stream/player-event-stream';

async function xCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const soundName = command.rawArgs.trim();
  if (!soundName) {
    throw new Error('Podaj nazwę dźwięku');
  }

  const xSound = await Container.get(XSoundService).getByName(soundName);

  const playXSoundEvent: PlayXSoundEvent = {
    id: 'PlayXSoundEvent',
    soundUrl: xSound.url,
  };

  PlayerEventStream.instance.sendToEveryone(playXSoundEvent);
  Container.get(XSoundService).incrementPlayCount(xSound.name);

  return makeSingleTextProcessingResponse(':ultrafastparrot:', false);
}

const xCommandDefinition: CommandDefinition = {
  key: 'x',
  processor: xCommandProcessor,
  helpMessage: 'Puszcza szalony dźwięk!',
  helpUsages: [
    '<sound name>',
    'airhorn',
  ],
};

export default xCommandDefinition;
