import ProcessFunction from './ProcessFunction';

interface CommandDefinition {
  key: string;
  shortKey?: string;
  process: ProcessFunction;
  helpMessage: string;
}

export default CommandDefinition;
