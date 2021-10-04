import Command from '../model/command';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import CommandDefinition from '../model/command-definition';
import XSoundsService from '../../x-sounds/x-sounds-service';

async function tagRemoveCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const commandArgs = command.getArgsByDelimiter('|');

  if (commandArgs.length < 2) {
    throw new Error('Zbyt mała liczba argumentów');
  }

  const [tagName, soundName] = commandArgs;

  await XSoundsService.instance.removeTag(soundName, tagName);
  return makeSingleTextProcessingResponse(`Usunięto tag "${tagName}" z dźwięku ${soundName}`, false);
}

const tagRemoveCommandDefinition: CommandDefinition = {
  key: 'tag-remove',
  processor: tagRemoveCommandProcessor,
  helpMessage: 'Usuwa tag z podanego dźwięku',
  helpUsages: [
    '<tag-name>|<sound name>',
    'fun stuff|airhorn',
  ],
};

export default tagRemoveCommandDefinition;
