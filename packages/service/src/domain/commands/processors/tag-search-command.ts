import XSoundsService from '../../x-sounds/x-sounds-service';
import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse from '../model/command-processing-response';

async function tagSearchCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const tagName = command.rawArgs.trim();
  if (!tagName) {
    throw new Error('Podaj nazwę tagu');
  }

  const sounds = await XSoundsService.instance.getAllByTag(tagName);

  if (sounds.length === 0) {
    throw new Error(`Nie ma dźwięków z tagiem "${tagName}"`);
  }

  const tagListText = sounds
    .map((sound) => sound.name)
    .map((soundName) => `- ${soundName}`)
    .join('\n');

  return {
    messages: [
      { type: 'HEADER', text: `Dźwięki z tagiem ${tagName}` },
      { type: 'MARKDOWN', text: tagListText },
    ],
    isVisibleToIssuerOnly: false,
  };
}

const tagSearchCommandDefinition: CommandDefinition = {
  key: 'tag-search',
  shortKey: 'ts',
  processor: tagSearchCommandProcessor,
  helpMessage: 'Wyszukuje dźwięki z danym tagiem',
  helpUsages: [
    '<tag name>',
    'fun stuff',
  ],
};

export default tagSearchCommandDefinition;
