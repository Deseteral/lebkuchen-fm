import Command from '../model/command';
import CommandProcessingResponse from '../model/command-processing-response';

type ProcessFunction = (command: Command) => Promise<CommandProcessingResponse>;

namespace CommandDefinition {
  type Constructor<T> = {
    new(...args: any[]): T;
    readonly prototype: T;
  }
  const implementations: Constructor<CommandDefinition>[] = [];
  export function GetImplementations(): Constructor<CommandDefinition>[] {
    return implementations;
  }
  export function register<T extends Constructor<CommandDefinition>>(constructor: T): T {
    implementations.push(constructor);
    return constructor;
  }
}

// eslint-disable-next-line no-redeclare
interface CommandDefinition {
  key: string;
  shortKey?: string;
  processor: ProcessFunction;
  helpMessage: string;
  helpUsages?: string[];
}

export default CommandDefinition;
