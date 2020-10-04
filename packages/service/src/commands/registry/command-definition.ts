import Command from '../command';
import MessageBlock from '../message-block';

type ProcessFunction = (command: Command) => Promise<MessageBlock[]>;

interface CommandDefinition {
  key: string,
  shortKey?: string,
  processor: ProcessFunction,
  helpMessage: string,
}

export default CommandDefinition;
