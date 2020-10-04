import Command from '../command';
import CommandProcessingResponse, { makeSingleTextMessage } from '../command-processing-response';
import CommandDefinition from '../registry/command-definition';

async function echoCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  return {
    messages: makeSingleTextMessage(command.rawArgs),
    isVisibleToIssuerOnly: false,
  };
}

const echoCommandDefinition: CommandDefinition = {
  key: 'echo',
  processor: echoCommandProcessor,
  helpMessage: 'Komenda echo',
};

export default echoCommandDefinition;
