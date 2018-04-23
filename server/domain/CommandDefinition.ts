import ProcessFunction from './ProcessFunction';

interface CommandDefinition {
  key: string;
  process: ProcessFunction;
  helpMessage: string;
}

export default CommandDefinition;
