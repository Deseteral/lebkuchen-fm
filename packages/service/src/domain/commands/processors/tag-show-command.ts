import XSoundsService from '../../x-sounds/x-sounds-service';
import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';

async function tagShowCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const soundName = command.rawArgs.trim();
  if (!soundName) {
    throw new Error('Podaj nazwę dźwięku');
  }

  const tags = await XSoundsService.instance.getSoundTags(soundName);

  if (tags.length === 0) {
    return makeSingleTextProcessingResponse(`Do dźwięku "${soundName}" nie ma przyspisanych żadnych tagów`, false);
  }

  const tagListText = tags
    .map((tagName) => `- ${tagName}`)
    .join('\n');

  return {
    messages: [
      { type: 'HEADER', text: `Tagi dla "${soundName}"` },
      { type: 'MARKDOWN', text: tagListText },
    ],
    isVisibleToIssuerOnly: false,
  };
}

const tagShowCommandDefinition: CommandDefinition = {
  key: 'tag-show',
  processor: tagShowCommandProcessor,
  helpMessage: 'Wyświetla wszystkie tagi przypisane do dźwięku',
  helpUsages: [
    '<sound name>',
    'airhorn',
  ],
};

export default tagShowCommandDefinition;
