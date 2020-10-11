import CommandProcessingResponse from '../model/command-processing-response';
import CommandDefinition from '../model/command-definition';
import * as XSoundsService from '../../x-sounds/x-sounds-service';

async function listXCommandProcessor(): Promise<CommandProcessingResponse> {
  const sounds = await XSoundsService.getAll();

  if (sounds.length === 0) {
    throw new Error('Brak dźwięków w bazie');
  }

  const soundListText = sounds
    .map((sound) => `- ${sound.name}`)
    .join('\n');

  return {
    messages: [
      { type: 'HEADER', text: 'X Sounds list' },
      { type: 'MARKDOWN', text: soundListText },
    ],
    isVisibleToIssuerOnly: false,
  };
}

const listXCommandDefinition: CommandDefinition = {
  key: 'listx',
  processor: listXCommandProcessor,
  helpMessage: 'Wypisuje listę czaderskich dźwięków w bazie',
};

export default listXCommandDefinition;
