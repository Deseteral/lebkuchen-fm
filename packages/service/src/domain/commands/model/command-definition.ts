import Command from '../model/command';
import CommandProcessingResponse from '../model/command-processing-response';

type ProcessFunction = (command: Command) => Promise<CommandProcessingResponse>;

interface CommandDefinition {
  key: string,
  shortKey?: string,
  processor: ProcessFunction,
  helpMessage: string,
  helpUsages?: string[],
}

export default CommandDefinition;
