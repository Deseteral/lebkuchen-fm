/* eslint-disable max-classes-per-file */
import { ExecutionContext } from '@service/domain/commands/execution-context';
import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse } from '@service/domain/commands/model/command-processing-response';

export abstract class CommandProcessor {
  abstract execute(command: Command, context: ExecutionContext): Promise<CommandProcessingResponse>

  abstract get key(): string;
  abstract get shortKey(): (string | null);
  abstract get helpMessage(): string;
  abstract get exampleUsages(): string[];
  abstract get parameters(): CommandParameters;
}

export interface CommandParameters {
  parameters: CommandParameter[],
  delimeter: (string | null),
}

export interface CommandParameter {
  required: boolean,
  names: string[],
}

export class CommandParametersBuilder {
  parameters: CommandParameter[] = [];
  delimeter: (string|null) = null;

  withRequired(name: string): CommandParametersBuilder {
    this.parameters.push({ required: true, names: [name] });
    return this;
  }

  withOptional(name: string): CommandParametersBuilder {
    this.parameters.push({ required: false, names: [name] });
    return this;
  }

  withRequiredOr(...names: string[]): CommandParametersBuilder {
    this.parameters.push({ required: true, names });
    return this;
  }

  withOptionalOr(...names: string[]): CommandParametersBuilder {
    this.parameters.push({ required: false, names });
    return this;
  }

  withDelimeter(delimeter: string): CommandParametersBuilder {
    this.delimeter = delimeter;
    return this;
  }

  build(): CommandParameters {
    return {
      parameters: this.parameters,
      delimeter: this.delimeter,
    };
  }

  buildEmpty(): CommandParameters {
    return {
      parameters: [],
      delimeter: null,
    };
  }
}
