import { ExecutionContext } from '@service/domain/commands/execution-context';
import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse } from '@service/domain/commands/model/command-processing-response';

abstract class CommandProcessor {
  abstract execute(command: Command, context: ExecutionContext): Promise<CommandProcessingResponse>

  abstract get key(): string;
  abstract get shortKey(): (string | null);
  abstract get helpMessage(): string;
  abstract get exampleUsages(): (string[] | null);
}

export { CommandProcessor };
