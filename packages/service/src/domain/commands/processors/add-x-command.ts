import Command, { getCommandArgsByDelimiter } from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextMessage } from '../model/command-processing-response';
import * as XSoundService from '../../x-sounds/x-sounds-service';

async function addXCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const commandArgs = getCommandArgsByDelimiter(command, '|');

  if (commandArgs.length < 2) {
    return {
      messages: makeSingleTextMessage('Zbyt mała liczba argumentów'),
      isVisibleToIssuerOnly: false,
    };
  }

  const [name, url] = commandArgs;

  const foundSound = await XSoundService.getByName(name);
  if (foundSound !== null) {
    return {
      messages: makeSingleTextMessage(`Dźwięk o nazwie "${name}" już jest w bazie`),
      isVisibleToIssuerOnly: false,
    };
  }

  await XSoundService.createNewSound(name, url);

  return {
    messages: makeSingleTextMessage(`Dodałem dźwięk "${name}" do biblioteki`),
    isVisibleToIssuerOnly: false,
  };
}

const addXCommandDefinition: CommandDefinition = {
  key: 'addx',
  processor: addXCommandProcessor,
  helpMessage: 'Dodaje efekt dźwiękowy (addx name|url)',
};

export default addXCommandDefinition;
