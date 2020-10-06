import Command from '../model/command';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import CommandDefinition from '../model/command-definition';

async function echoCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  return makeSingleTextProcessingResponse(command.rawArgs, false);
}

const echoCommandDefinition: CommandDefinition = {
  key: 'echo',
  processor: echoCommandProcessor,
  helpMessage: 'Komenda echo',
};

export default echoCommandDefinition;
