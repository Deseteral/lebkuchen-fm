import Command from '../command';
import MessageBlock, { makeSingleTextMessage } from '../message-block';
import CommandDefinition from '../registry/command-definition';

async function echoCommandProcessor(command: Command): Promise<MessageBlock[]> {
  return makeSingleTextMessage(command.rawArgs);
}

const echoCommandDefinition: CommandDefinition = {
  key: 'echo',
  processor: echoCommandProcessor,
  helpMessage: 'Komenda echo',
};

export default echoCommandDefinition;
