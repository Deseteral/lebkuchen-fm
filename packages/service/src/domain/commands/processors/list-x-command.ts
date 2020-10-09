import CommandProcessingResponse, { MessageBlock } from '../model/command-processing-response';
import CommandDefinition from '../model/command-definition';
import * as XSoundsService from '../../x-sounds/x-sounds-service';

async function listXCommandProcessor(): Promise<CommandProcessingResponse> {
  const sounds = await XSoundsService.getAll();

  if (sounds.length === 0) {
    throw new Error('Brak dźwięków w bazie');
  }

  const soundNames: MessageBlock[] = sounds
    .map((sound) => sound.name)
    .map((soundName) => ({ type: 'PLAIN_TEXT', text: soundName }));

  return {
    messages: [{ type: 'HEADER', text: 'X Sounds list' }, ...soundNames],
    isVisibleToIssuerOnly: false,
  };
}

const listXCommandDefinition: CommandDefinition = {
  key: 'listx',
  processor: listXCommandProcessor,
  helpMessage: 'Wypisuje listę czaderskich dźwięków w bazie',
};

export default listXCommandDefinition;