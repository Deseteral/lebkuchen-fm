import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import XSoundService from '../../x-sounds/x-sounds-service';

async function addXCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const commandArgs = command.getArgsByDelimiter('|');

  if (commandArgs.length < 2) {
    throw new Error('Zbyt mała liczba argumentów');
  }

  const [name, url] = commandArgs;
  await XSoundService.instance.createNewSound(name, url);

  return makeSingleTextProcessingResponse(`Dodałem dźwięk "${name}" do biblioteki`, false);
}

const addXCommandDefinition: CommandDefinition = {
  key: 'addx',
  processor: addXCommandProcessor,
  helpMessage: 'Dodaje efekt dźwiękowy',
  helpUsages: [
    '<name>|<sound-url>',
    'airhorn|https://example.com/airhorn.wav',
  ],
};

export default addXCommandDefinition;
