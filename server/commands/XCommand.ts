import CommandDefinition from '../domain/CommandDefinition';
import IoConnection from '../clients/IoConnection';
import XRepository from '../repositories/XRepository';
import XEventMessage from '../domain/event-messages/XEventMessage';
import XSound from '../domain/XSound';

async function xProcess(soundName: string) : Promise<string> {
  const xsound: XSound = await XRepository.getByName(soundName);
  const xEventMessage: XEventMessage = {
    soundUrl: xsound.url,
  };

  IoConnection.broadcast('x', xEventMessage);
  return '';
}

const commandDefinition: CommandDefinition = {
  key: 'x',
  process: xProcess,
  helpMessage: 'Puszcza szalony dźwięk! :parrot:',
};

export default commandDefinition;
