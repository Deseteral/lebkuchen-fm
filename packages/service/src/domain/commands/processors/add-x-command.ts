import Command, { getCommandArgsByDelimiter } from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import * as XSoundService from '../../x-sounds/x-sounds-service';

async function addXCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const commandArgs = getCommandArgsByDelimiter(command, '|');

  if (commandArgs.length < 2) {
    throw new Error('Zbyt mała liczba argumentów');
  }

  const [name, url] = commandArgs;

  await XSoundService.createNewSound(name, url);
  return makeSingleTextProcessingResponse(`Dodałem dźwięk "${name}" do biblioteki`, false);
}

const addXCommandDefinition: CommandDefinition = {
  key: 'addx',
  processor: addXCommandProcessor,
  helpMessage: 'Dodaje efekt dźwiękowy (addx name|url)',
};

export default addXCommandDefinition;
