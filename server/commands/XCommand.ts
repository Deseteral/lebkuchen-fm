import CommandDefinition from '../domain/CommandDefinition';
import IoConnection from '../clients/IoConnection';
import XRepository from '../repositories/XRepository';
import XEventMessage from '../domain/event-messages/XEventMessage';
import XSound from '../domain/XSound';
import XSoundService from '../services/XSoundService';

async function xProcess(soundName: string) : Promise<string> {
  const xsound: XSound = await XRepository.getByName(soundName);

  if (!xsound) {
    return `Nie ma takiego dźwięku: ${soundName}`;
  }

  const xEventMessage: XEventMessage = {
    soundUrl: xsound.url,
  };

  IoConnection.broadcast('x', xEventMessage);
  XSoundService.bumpPlayCount(xsound.name);
  return ':ultrafastparrot:';
}

const commandDefinition: CommandDefinition = {
  key: 'x',
  process: xProcess,
  helpMessage: 'Puszcza szalony dźwięk! :parrot:',
};

export default commandDefinition;
