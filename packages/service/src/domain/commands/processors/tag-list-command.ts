import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse from '../model/command-processing-response';
import Command from '../model/command';
import XSoundsService from '../../x-sounds/x-sounds-service';

async function tagListCommandProcessor(_: Command): Promise<CommandProcessingResponse> {
  const tags = await XSoundsService.instance.getAllUniqueTags();
  const tagListText = tags.join('\n');

  return {
    messages: [
      { type: 'HEADER', text: 'Wszystkie tagi' },
      { type: 'MARKDOWN', text: tagListText },
    ],
    isVisibleToIssuerOnly: false,
  };
}

const tagListCommandDefinition: CommandDefinition = {
  key: 'tag-list',
  shortKey: 'tl',
  processor: tagListCommandProcessor,
  helpMessage: 'Wyświetla wszystkie unikatowe tagi',
};

export default tagListCommandDefinition;
