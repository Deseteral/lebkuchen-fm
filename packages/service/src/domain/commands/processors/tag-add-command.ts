import Command from '../model/command';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import CommandDefinition from '../model/command-definition';
import XSoundsService from '../../x-sounds/x-sounds-service';

async function tagAddCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const commandArgs = command.getArgsByDelimiter('|');

  if (commandArgs.length < 2) {
    throw new Error('Zbyt mała liczba argumentów');
  }

  const [tagName, soundName] = commandArgs;

  await XSoundsService.instance.addTag(soundName, tagName);
  return makeSingleTextProcessingResponse(`Dodano tag "${tagName}" do dźwięku ${soundName}`, false);
}

const tagAddCommandDefinition: CommandDefinition = {
  key: 'tag-add',
  shortKey: 'ta',
  processor: tagAddCommandProcessor,
  helpMessage: 'Dodaje tag do podanego dźwięku',
  helpUsages: [
    '<tag-name>|<sound name>',
    'fun stuff|airhorn',
  ],
};

export default tagAddCommandDefinition;
