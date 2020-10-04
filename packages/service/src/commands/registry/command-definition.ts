import Command from '../command';
import CommandProcessingResponse from '../command-processing-response';

type ProcessFunction = (command: Command) => Promise<CommandProcessingResponse>;

interface CommandDefinition {
  key: string,
  shortKey?: string,
  processor: ProcessFunction,
  helpMessage: string,
}

export default CommandDefinition;
